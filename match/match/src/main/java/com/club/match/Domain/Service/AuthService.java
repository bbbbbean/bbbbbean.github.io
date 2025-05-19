package com.club.match.Domain.Service;

import com.club.match.Component.JwtTokenProvider;
import com.club.match.Domain.DTO.*;
import com.club.match.Mapper.UserMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
@Slf4j
public class AuthService {

    @Autowired
    AuthenticationManagerBuilder authenticationManagerBuilder;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    UserMapper userMapper;

    @Value("${spring.security.oauth2.client.kakao.logout.redirect.uri}")
    String LOGOUT_REDIRECT_URI;

    @Value("${portOne.key}")
    String PORTONE_KEY;
    @Value("${portOne.secret.key}")
    String PORTONE_SECRET_KEY;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    String KAKAO_CLIENT_ID;
    String RESPONSE_TYPE = "code";

    @Transactional(rollbackFor = Exception.class)
    public boolean joinUser(UserDTO userDTO) {
        boolean isOk = userMapper.insertUser(userDTO) > 0;
        return isOk;
    }

    @Transactional(rollbackFor = Exception.class)
    public JwtTokenDTO login(String userId, String password) {
        UsernamePasswordAuthenticationToken authenticationToken = new
                UsernamePasswordAuthenticationToken(userId, password);

        Authentication authentication =
                authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        JwtTokenDTO jwtTokenDTO = jwtTokenProvider.createToken(authentication);

        return jwtTokenDTO;
    }

    @Transactional(rollbackFor = Exception.class)
    public UserDTO selectOne(String userId) {
        UserDTO userDTO = userMapper.selectAt(userId);
        return userDTO;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean addSocialLink(SocialLinkDTO socialLinkDTO) {
        boolean isAdded = userMapper.insertSocialLink(socialLinkDTO) > 0;

        return isAdded;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean unSocialLink(SocialLinkDTO socialLinkDTO) {
        boolean isDel = userMapper.deleteSocialLink(socialLinkDTO) > 0;

        return isDel;
    }

    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> socialLogin(SocialLinkDTO socialLinkDTO) {
        Map<String, Object> resp = new HashMap<>();
        List<SocialLinkDTO> respSocialLinkDTO = userMapper.userLinkAt(socialLinkDTO);
        if (respSocialLinkDTO == null) {
            resp.put("errorCode", socialLinkDTO.getPlatformType());
            return resp;
        }
        UserDTO userDTO = userMapper.selectAt(respSocialLinkDTO.get(0).getUserId());
        UserDetails userDetails = User.builder()
                .username(userDTO.getUserId())
                .password("")
                .roles(userDTO.getRole())
                .build();
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        JwtTokenDTO jwtTokenDTO = jwtTokenProvider.createToken(authenticationToken);

        resp.put("jwtTokenDTO", jwtTokenDTO);

        userDTO.setPassword(null);
        userDTO.setRole(null);
        userDTO.setProfile(null);

        resp.put("userDTO", userDTO);

        return resp;
    }

    public String portOneGetToken() {


        String url = "https://api.iamport.kr/users/getToken";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();

        params.add("imp_key", PORTONE_KEY);
        params.add("imp_secret", PORTONE_SECRET_KEY);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

        RestTemplate rt = new RestTemplate();

        ResponseEntity<PortOneDTO> response =
                rt.exchange(url, HttpMethod.POST, entity, PortOneDTO.class);

        PortOneDTO portOneDTO = response.getBody();

        return portOneDTO.getResponse().getAccess_token();
    }

    public PortOneDTO portOneGetData(String imp_uid, String accessToken) {


        String url = "https://api.iamport.kr/certifications/"+imp_uid;

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", accessToken);
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();

        params.add("imp_key", PORTONE_KEY);
        params.add("imp_secret", PORTONE_SECRET_KEY);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

        RestTemplate rt = new RestTemplate();

        ResponseEntity<PortOneDTO> response =
                rt.exchange(url, HttpMethod.GET, entity, PortOneDTO.class);

        PortOneDTO portOneDTO = response.getBody();

        return portOneDTO;
    }


    public ResponseEntity<KakaoDTO> kakaoOauth(String code, String redirect_url) {


        String url = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();

        params.add("grant_type", "authorization_code");
        params.add("client_id", KAKAO_CLIENT_ID);
        params.add("redirect_uri", redirect_url);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

        RestTemplate rt = new RestTemplate();

        ResponseEntity<KakaoDTO> response =
                rt.exchange(url, HttpMethod.POST, entity, KakaoDTO.class);

        return response;
    }

    public ResponseEntity<KakaoDTO> getUserKakaoId(String access_token) {

        String url = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();

        headers.add("Authorization", "Bearer " + access_token);

        RestTemplate rt = new RestTemplate();

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(headers);

        ResponseEntity<KakaoDTO> response = rt.exchange(url, HttpMethod.POST, entity, KakaoDTO.class);

        return response;
    }
    @Transactional(rollbackFor = Exception.class)
    public boolean phoneCkeck(String phone) {
        boolean isPhone = userMapper.selectUserPhone(phone) != 0;
        return isPhone;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean leaveUser(String userId) {
        boolean isDelete = userMapper.deleteUser(userId) > 0;
        return isDelete;
    }
}
