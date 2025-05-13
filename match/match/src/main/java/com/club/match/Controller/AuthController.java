package com.club.match.Controller;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import com.club.match.Component.JwtTokenProvider;
import com.club.match.Domain.DTO.JwtTokenDTO;
import com.club.match.Domain.DTO.KakaoDTO;
import com.club.match.Domain.DTO.SocialLinkDTO;
import com.club.match.Domain.DTO.UserDTO;
import com.club.match.Domain.Service.AuthService;
import jakarta.servlet.http.HttpSession;
import lombok.Data;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.client.RestTemplate;

@RestController
@Slf4j
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping("/myInfoPwdCheck")
    public ResponseEntity<?> pwdCheck(@RequestBody Map<String,Object> req){
        Map<String, Object> resp = new HashMap<>();
        String userId = (String)req.get("userId");
        String password = (String)req.get("password");
        UserDTO userDTO = authService.selectOne(userId);
        boolean isOk = passwordEncoder.matches(password,userDTO.getPassword());
        resp.put("success",isOk);
        if(!isOk) {
            resp.put("message","비밀번호가 일치하지 않습니다");
        } else {
            userDTO.setPassword("");
            userDTO.setRole("");
            resp.put("userDTO", userDTO);
        }
        return ResponseEntity.ok().body(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<?> userLogin(@RequestBody @Validated UserDTO userDTO) {
        Map<String, Object> resp = new HashMap<>();

        String userId = userDTO.getUserId();
        String password = userDTO.getPassword();
        log.info("request username = {}, password = {}", userId, password);
        JwtTokenDTO jwtTokenDTO = authService.login(userId,password);
        log.info("jwtToken accessToken = {}, refreshToken = {}", jwtTokenDTO.getAccessToken(), jwtTokenDTO.getRefreshToken());
        resp.put("jwtToken", jwtTokenDTO.getAccessToken());

        ResponseCookie cookie = ResponseCookie.from("refreshToken", jwtTokenDTO.getRefreshToken())
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .build();

        userDTO = authService.selectOne(userId);
        userDTO.setPassword(null);
        userDTO.setRole(null);
        userDTO.setProfile(null);
        userDTO.setAddress(null);
        userDTO.setPhone(null);

        resp.put("userDTO",userDTO);

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(resp);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> userLogout() {
        Map<String, Object> resp = new HashMap<>();

        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(null);
    }


    @PostMapping("/reneToken")
    public ResponseEntity<?> reneToken(@CookieValue("refreshToken") String refreshToken){

        Map<String, Object> resp = new HashMap<>();

        boolean isOk = jwtTokenProvider.validateToken(refreshToken);

        Authentication authentication = jwtTokenProvider.getAuthentication(refreshToken);

        if(isOk) {
            JwtTokenDTO jwtTokenDTO = jwtTokenProvider.createToken(authentication);
            log.info("재발행 토큰 AccessToken : " + jwtTokenDTO.getAccessToken());
            log.info("재발행 토큰 RefreshToken : " + jwtTokenDTO.getRefreshToken());

            resp.put("jwtToken",jwtTokenDTO.getAccessToken());

            ResponseCookie cookie = ResponseCookie.from("refreshToken", jwtTokenDTO.getRefreshToken())
                    .httpOnly(true)
                    .path("/")
                    .maxAge(Duration.ofDays(1))
                    .build();

            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(resp);
        }
        return ResponseEntity.badRequest().body(null);
    }

    String REDIRECT_URI = "http://localhost:3000/user/kakaoCode";
    String CLIENT_ID = "";
    String RESPONSE_TYPE = "code";

    @PostMapping("/kakao")
    public ResponseEntity<?> kakaoCallback(@RequestBody Map<String,Object> req) {

        String code = (String)req.get("code");

        String url1 = "https://kauth.kakao.com/oauth/token";
        String url2 = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        MultiValueMap<String,String> params = new LinkedMultiValueMap<>();

        params.add("grant_type","authorization_code");
        params.add("client_id",CLIENT_ID);
        params.add("redirect_uri",REDIRECT_URI);
        params.add("code",code);

        HttpEntity<MultiValueMap<String,String>> entity = new HttpEntity<>(params, headers);

        RestTemplate rt = new RestTemplate();
        ResponseEntity<KakaoTokenRespoonse> response =
            rt.exchange(url1, HttpMethod.POST,entity, KakaoTokenRespoonse.class);

        headers.add("Authorization","Bearer "+response.getBody().access_token);

        entity = new HttpEntity<>(headers);
        ResponseEntity<KakaoDTO> response2 = rt.exchange(url2, HttpMethod.POST,entity, KakaoDTO.class);

        Map<String,Object> authResp =  authService.socialLogin(SocialLinkDTO.builder()
                .platformType("2")
                .linkedId(response2.getBody().getId()).build());

        JwtTokenDTO jwtTokenDTO = (JwtTokenDTO)authResp.get("jwtTokenDTO");
        UserDTO userDTO = (UserDTO)authResp.get("userDTO");

        Map<String,Object> resp = new HashMap<>();

        ResponseCookie cookie = ResponseCookie.from("refreshToken", jwtTokenDTO.getRefreshToken())
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .build();

        userDTO.setPassword(null);
        userDTO.setRole(null);
        userDTO.setProfile(null);
        userDTO.setAddress(null);
        userDTO.setPhone(null);

        resp.put("jwtToken", jwtTokenDTO.getAccessToken());
        resp.put("userDTO",userDTO);

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(resp);
    }

    @Data
    private static class KakaoTokenRespoonse{
        public String token_type;
        public String access_token;
        public String id_token;
        public Integer expires_in;
        public String refresh_token;
        public Integer refresh_token_expires_in;
        public String scope;
    }
}
