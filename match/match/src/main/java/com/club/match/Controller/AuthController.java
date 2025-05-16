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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import lombok.extern.slf4j.Slf4j;

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

    @PostMapping("/sign")
    public ResponseEntity<?> userSign(@RequestBody Map<String,String> req) {
        Map<String, Object> resp = new HashMap<>();

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

    @PostMapping("/unLink")
    public ResponseEntity<?> UnLink(@RequestBody @Validated SocialLinkDTO socialLinkDTO) {

        boolean isOk = authService.unSocialLink(socialLinkDTO);

        if(!isOk){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        return ResponseEntity.ok().body(null);
    }

    @PostMapping("/kakaoLink")
    public ResponseEntity<?> kakaoLink(@RequestBody Map<String, Object> req) {

        Map<String,Object> resp = new HashMap<>();

        String code = (String) req.get("code");
        String redirect_url = ((String) req.get("url")).split("&")[0];

        log.info("code : " + code);
        log.info("redirect_url : " + redirect_url);

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

        boolean isAdded = authService.addSocialLink(socialLinkDTO);

        resp.put("success",true);
        return ResponseEntity.ok().body(resp);
    }
}
