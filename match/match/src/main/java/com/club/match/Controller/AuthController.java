package com.club.match.Controller;

import java.io.File;
import java.io.IOException;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.club.match.Component.JwtTokenProvider;
import com.club.match.Domain.DTO.*;
import com.club.match.Domain.Service.AuthService;
import com.club.match.Domain.Service.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Value;
import org.apache.catalina.User;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping("/check-id")
    public ResponseEntity<?> userCheck(@RequestBody Map<String,String> req) {

        String userId = (String) req.get("userId");
        UserDTO userDTO = authService.selectOne(userId);
        if(userDTO == null) {
            return ResponseEntity.ok().body(null);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PostMapping("/sign")
    public ResponseEntity<?> userSign(@RequestBody @Validated SignDTO signDTO) {
        Map<String, Object> resp = new HashMap<>();

        if(!signDTO.isIdCheck()){
            resp.put("fail","아이디 중복을 확인해주세요");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else if(!signDTO.isAuthCheck()){
            resp.put("fail","본인인증이 진행되지 않았습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else if(!signDTO.getPassword().equals(signDTO.getRepassword())){
            resp.put("fail","비밀번호가 일치하지 않습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        String portoneToken = authService.portOneGetToken();



        PortOneDTO portOneDTO = authService.portOneGetData(signDTO.getImp_uid(), portoneToken);

        boolean isPhone = authService.phoneCkeck(portOneDTO.getResponse().getPhone());

        if(isPhone){
            resp.put("fail","같은 명의로 등록된 계정이 있습니다.");
            resp.put("authReset",1);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        UserDTO userDTO = UserDTO.builder()
                .userId(signDTO.getUserId())
                .nickName(signDTO.getNickName())
                .password(passwordEncoder.encode(signDTO.getPassword()))
                .name(portOneDTO.getResponse().getName())
                .gender(portOneDTO.getResponse().getGender())
                .phone(portOneDTO.getResponse().getPhone())
                .birthday(portOneDTO.getResponse().getBirthday())
                .introduction("기본 소개")
                .address("지역을 설정해주세요")
                .profile("http://localhost:8100/profile/"+signDTO.getUserId())
                .manner(100)
                .points(0)
                .isPrivate(false)
                .createAt(LocalDate.now())
                .build();

        String Path = "src/main/resources/defaultUser"; // 복사할 원본 폴더
        String copyPath = "src/main/resources/Users/" + signDTO.getUserId(); // 복사할 위치

        File Dir = new File(Path);
        File copyDir = new File(copyPath);

        try{
            FileUtils.copyDirectory(Dir,copyDir);
        } catch (IOException e) {
            log.error("폴더 생성 실패 : " + e.getMessage());
        }

        boolean isOk = authService.joinUser(userDTO);

        System.out.println(userDTO);
        return ResponseEntity.ok().body(null);
    }

    @PostMapping("/remove")
    public ResponseEntity<?> userRemove(@RequestBody Map<String,String> req, @RequestHeader String Authorization) throws IOException {

        String userId = (String) req.get("userId");
        String accessToken = (String)(Authorization.substring(7));

        String userPath = "src/main/resources/Users/" + userId;

        // 토큰 ID값과 USERID값 비교
        Claims claims = jwtTokenProvider.parseClaims(accessToken);

        boolean isOk = userId.equals(claims.get("sub"));
        System.out.println(isOk);

        if(!isOk) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        File userDir = new File(userPath);

        FileUtils.deleteDirectory(userDir);

        boolean isDelete = authService.leaveUser(userId);

        return ResponseEntity.ok().body(null);
    }

    @PostMapping("/login")
    public ResponseEntity<?> userLogin(@RequestBody @Validated UserDTO userDTO) {
        Map<String, Object> resp = new HashMap<>();

        String userId = userDTO.getUserId();
        String password = userDTO.getPassword();
        JwtTokenDTO jwtTokenDTO = authService.login(userId, password);
        resp.put("jwtToken", jwtTokenDTO.getAccessToken());

        ResponseCookie cookie = ResponseCookie.from("refreshToken", jwtTokenDTO.getRefreshToken())
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .build();

        userDTO = authService.selectOne(userId);
        userDTO.setPassword(null);
        userDTO.setRole(null);
        userDTO.setPlatform("0");

        resp.put("userDTO", userDTO);

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(resp);
    }

    @PostMapping("/oAuthLogin")
    public ResponseEntity<?> oAuthLogin(@RequestBody Map<String,String> req) {
        Map<String, Object> resp = new HashMap<>();

        String userId = (String)req.get("userId");

        UserDTO userDTO = authService.selectOne(userId);
        userDTO.setPassword(null);
        userDTO.setRole(null);

        resp.put("userDTO", userDTO);

        return ResponseEntity.ok().body(resp);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> userLogout(){
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

        ResponseEntity<KakaoDTO> oauthResponse = authService.kakaoOauth(code,redirect_url);

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
