package com.club.match.Controller;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.club.match.Component.JwtTokenProvider;
import com.club.match.Domain.DTO.JwtTokenDTO;
import com.club.match.Domain.DTO.KakaoDTO;
import com.club.match.Domain.DTO.SocialLinkDTO;
import com.club.match.Domain.DTO.UserDTO;
import com.club.match.Domain.Service.AuthService;
import com.club.match.Domain.Service.UserService;
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
    UserService userService;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping("/myInfoPwdCheck")
    public ResponseEntity<?> pwdCheck(@RequestBody Map<String, Object> req) {
        Map<String, Object> resp = new HashMap<>();
        String userId = (String) req.get("userId");
        String password = (String) req.get("password");
        UserDTO userDTO = authService.selectOne(userId);
        boolean isOk = passwordEncoder.matches(password, userDTO.getPassword());
        resp.put("success", isOk);
        if (!isOk) {
            resp.put("message", "비밀번호가 일치하지 않습니다");
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
        JwtTokenDTO jwtTokenDTO = authService.login(userId, password);
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

        resp.put("userDTO", userDTO);

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
    public ResponseEntity<?> reneToken(@CookieValue("refreshToken") String refreshToken) {

        Map<String, Object> resp = new HashMap<>();

        boolean isOk = jwtTokenProvider.validateToken(refreshToken);

        Authentication authentication = jwtTokenProvider.getAuthentication(refreshToken);

        if (isOk) {
            JwtTokenDTO jwtTokenDTO = jwtTokenProvider.createToken(authentication);
            log.info("재발행 토큰 AccessToken : " + jwtTokenDTO.getAccessToken());
            log.info("재발행 토큰 RefreshToken : " + jwtTokenDTO.getRefreshToken());

            resp.put("jwtToken", jwtTokenDTO.getAccessToken());

            ResponseCookie cookie = ResponseCookie.from("refreshToken", jwtTokenDTO.getRefreshToken())
                    .httpOnly(true)
                    .path("/")
                    .maxAge(Duration.ofDays(1))
                    .build();

            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(resp);
        }
        return ResponseEntity.badRequest().body(null);
    }

    @PostMapping("/kakaoLink")
    public ResponseEntity<?> kakaoLink(@RequestBody Map<String, Object> req) {

        Map<String,Object> resp = new HashMap<>();

        String code = (String) req.get("code");
        String redirect_url = ((String) req.get("url")).split("&")[0];

        ResponseEntity<KakaoDTO> oauthResponse = authService.oauth(code,redirect_url);

        ResponseEntity<KakaoDTO> kakaoUserInfoResponse = authService.getUserKakaoId(oauthResponse.getBody().access_token);

        String userId = (String) req.get("userId");
        String linkedID = kakaoUserInfoResponse.getBody().getId();
        String email = kakaoUserInfoResponse.getBody().getKakao_account().getEmail();

        SocialLinkDTO socialLinkDTO = SocialLinkDTO.builder()
                .userId(userId)
                .platformType("2")
                .linkedId(linkedID)
                .email(email)
                .build();

        List<SocialLinkDTO> socialLinkDTO1  = (List<SocialLinkDTO>)userService.searchUserAccountLink(socialLinkDTO).get("socialLinkDTO");
        if(socialLinkDTO1.size() > 0) {
            resp.put("FailCode","2");
            resp.put("success",false);
            return ResponseEntity.ok().body(resp);
        }

        boolean isAdded = authService.addAccountLink(socialLinkDTO);

        resp.put("success",true);
        return ResponseEntity.ok().body(resp);
    }
        @PostMapping("/kakaoLogin")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, Object> req) {

        String code = (String) req.get("code");
        String redirect_url = ((String) req.get("url")).split("\\?")[0];
        log.info(redirect_url);

        ResponseEntity<KakaoDTO> oauthResponse = authService.oauth(code,redirect_url);

        ResponseEntity<KakaoDTO> kakaoUserInfoResponse = authService.getUserKakaoId(oauthResponse.getBody().access_token);

        Map<String, Object> authResp = authService.socialLogin(SocialLinkDTO
                .builder()
                .platformType("2")
                .linkedId(kakaoUserInfoResponse.getBody().getId()).build());

        Map<String, Object> resp = new HashMap<>();

        if ((String)authResp.get("errorCode") != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(authResp);
        }

        JwtTokenDTO jwtTokenDTO = (JwtTokenDTO) authResp.get("jwtTokenDTO");
        UserDTO userDTO = (UserDTO) authResp.get("userDTO");

        ResponseCookie cookie = ResponseCookie.from("refreshToken", jwtTokenDTO.getRefreshToken())
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .build();

        resp.put("jwtToken", jwtTokenDTO.getAccessToken());
        resp.put("userDTO", userDTO);

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(resp);
    }
}
