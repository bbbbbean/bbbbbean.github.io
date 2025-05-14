package com.club.match.Domain.Service;

import com.club.match.Component.JwtTokenProvider;
import com.club.match.Config.auth.PrincipalDetailsService;
import com.club.match.Controller.AuthController;
import com.club.match.Domain.DTO.JwtTokenDTO;
import com.club.match.Domain.DTO.KakaoDTO;
import com.club.match.Domain.DTO.SocialLinkDTO;
import com.club.match.Domain.DTO.UserDTO;
import com.club.match.Mapper.UserMapper;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
    PrincipalDetailsService principalDetailsService;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    UserMapper userMapper;

    String CLIENT_ID = System.getenv("KAKAO");
    String RESPONSE_TYPE = "code";


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
    public boolean addAccountLink(SocialLinkDTO socialLinkDTO) {
        boolean isAdded = userMapper.insertAccountLink(socialLinkDTO) > 0;

        return isAdded;
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
        userDTO.setAddress(null);
        userDTO.setPhone(null);

        resp.put("userDTO", userDTO);

        return resp;
    }

    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<KakaoDTO> oauth(String code, String redirect_url) {


        String url = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();

        params.add("grant_type", "authorization_code");
        params.add("client_id", CLIENT_ID);
        params.add("redirect_uri", redirect_url);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

        RestTemplate rt = new RestTemplate();

        ResponseEntity<KakaoDTO> response =
                rt.exchange(url, HttpMethod.POST, entity, KakaoDTO.class);

        return response;
    }
    @Transactional(rollbackFor = Exception.class)
    public ResponseEntity<KakaoDTO> getUserKakaoId(String access_token) {

        String url = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();

        headers.add("Authorization", "Bearer " + access_token);

        RestTemplate rt = new RestTemplate();

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(headers);

        ResponseEntity<KakaoDTO> response = rt.exchange(url, HttpMethod.POST, entity, KakaoDTO.class);

        return response;
    }

}
