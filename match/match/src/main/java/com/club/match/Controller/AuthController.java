package com.club.match.Controller;

import java.io.Console;
import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.club.match.Config.auth.provider.JwtTokenProvider;
import com.club.match.Domain.DTO.*;
import com.club.match.Domain.Service.AuthService;
import com.club.match.Domain.Service.UserService;
import io.jsonwebtoken.Claims;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        String regex = "^[a-zA-Z0-9]{4,20}$";

        String userId = (String) req.get("userId");

        if(!userId.matches(regex)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

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

        // 패스워드
        String regex1 = "^(?=.*[a-zA-Z]).+$"; // 영문자 포함
        String regex2 = "^(?=.*[!@#$%^*+=-]).+$"; // 특수문자 포함
        String regex3 = "^(?=.*[0-9]).+$"; // 숫자 포함
        String regex4 = "^.{8,15}$"; // 길이 8~15자

        // 닉네임
        String regex5 = "^.{2,10}$";

        if(signDTO.getPassword().isEmpty() || signDTO.getNickName().isEmpty() || signDTO.getRepassword().isEmpty()){
            resp.put("fail","입력하지 않은 값이 존재합니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else if(!signDTO.isIdCheck()){
            resp.put("fail","아이디 체크를 확인해주세요");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else if(!signDTO.getNickName().matches(regex5)){
            resp.put("fail","닉네임은 2~10글자 사이여야 합니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else if(!signDTO.isAuthCheck()){
            resp.put("fail","본인인증이 진행되지 않았습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else if (!signDTO.getPassword().matches(regex1)) {
            resp.put("fail","비밀번호는 영어가 포함되어야 합니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else if (!signDTO.getPassword().matches(regex2)) {
            resp.put("fail","비밀번호는 특수문자가 포함되어야 합니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else if (!signDTO.getPassword().matches(regex3)) {
            resp.put("fail","비밀번호는 숫자가 포함되어야 합니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else if (!signDTO.getPassword().matches(regex4)) {
            resp.put("fail","비밀번호는 8~15자 사이여야 합니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else if(!signDTO.getPassword().equals(signDTO.getRepassword())){
            resp.put("fail","비밀번호 확인이 일치하지 않습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        String portoneToken = authService.portOneGetToken();

        PortOneDTO portOneDTO = authService.portOneGetData(signDTO.getImp_uid(), portoneToken);

        UserDTO userCkeck = authService.phoneCkeck(portOneDTO.getResponse().getPhone());

        if(userCkeck != null){
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

    @PostMapping("/idSearch")
    public ResponseEntity<?> idCheck(@RequestBody @Validated SignDTO signDTO) {
        Map<String, Object> resp = new HashMap<>();

        if(!signDTO.isAuthCheck()){
            resp.put("fail","본인인증이 진행되지 않았습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        log.info("signDTO.getImp_uid() : " + signDTO.getImp_uid());

        String portoneToken = authService.portOneGetToken();

        PortOneDTO portOneDTO = authService.portOneGetData(signDTO.getImp_uid(), portoneToken);

        UserDTO userCkeck = authService.phoneCkeck(portOneDTO.getResponse().getPhone());

        if(userCkeck == null){
            resp.put("fail","해당 명의로 등록된 계정이 없습니다.");
            resp.put("authReset",1);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else {
            userCkeck.setUserId(userCkeck.getUserId().substring(0, userCkeck.getUserId().length()-2)+"**");
            resp.put("userId", userCkeck.getUserId());
        }

        return ResponseEntity.ok().body(resp);
    }

    @PostMapping("/pwEdit")
    public ResponseEntity<?> pwEdit(@RequestBody @Validated SignDTO signDTO) {
        Map<String, Object> resp = new HashMap<>();

        String regex1 = "^(?=.*[a-zA-Z]).+$"; // 영문자 포함
        String regex2 = "^(?=.*[!@#$%^*+=-]).+$"; // 특수문자 포함
        String regex3 = "^(?=.*[0-9]).+$"; // 숫자 포함
        String regex4 = "^.{8,15}$"; // 길이 8~15자

        if(!signDTO.isAuthCheck()){
            resp.put("fail","본인인증이 진행되지 않았습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        log.info("signDTO.getImp_uid() : " + signDTO.getImp_uid());

        String portoneToken = authService.portOneGetToken();

        PortOneDTO portOneDTO = authService.portOneGetData(signDTO.getImp_uid(), portoneToken);

        UserDTO userCkeck = authService.phoneCkeck(portOneDTO.getResponse().getPhone());

        if(userCkeck == null){
            resp.put("fail","해당 명의로 등록된 계정이 없습니다.");
            resp.put("authReset",1);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }
        if(!userCkeck.getUserId().equals(signDTO.getUserId())){
            resp.put("fail","아이디가 틀렸습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }
        if (!signDTO.getPassword().matches(regex1)) {
            resp.put("fail","비밀번호는 영어가 포함되어야 합니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else if (!signDTO.getPassword().matches(regex2)) {
            resp.put("fail","비밀번호는 특수문자가 포함되어야 합니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else if (!signDTO.getPassword().matches(regex3)) {
            resp.put("fail","비밀번호는 숫자가 포함되어야 합니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else if (!signDTO.getPassword().matches(regex4)) {
            resp.put("fail","비밀번호는 8~15자 사이여야 합니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }else if(!signDTO.getPassword().equals(signDTO.getRepassword())){
            resp.put("fail","비밀번호 확인이 일치하지 않습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        userService.changeUserPassword(userCkeck.getUserId(), passwordEncoder.encode(signDTO.getPassword()));

        return ResponseEntity.ok().body(resp);

    }

    @PostMapping("/remove")
    public ResponseEntity<?> userRemove() throws IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userId = authentication.getName();

        String userPath = "src/main/resources/Users/" + userId;

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

        ResponseCookie cookie1 = ResponseCookie.from("accessToken", jwtTokenDTO.getAccessToken())
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .build();

        ResponseCookie cookie2 = ResponseCookie.from("refreshToken", jwtTokenDTO.getRefreshToken())
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .build();

        userDTO = authService.selectOne(userId);
        userDTO.setPassword(null);
        userDTO.setRole(null);
        userDTO.setPlatform("0");

        resp.put("userDTO", userDTO);

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie1.toString(), cookie2.toString()).body(resp);
    }

    @PostMapping("/oAuthLogin")
    public ResponseEntity<?> oAuthLogin() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Map<String, Object> resp = new HashMap<>();

        String userId = authentication.getName();

        UserDTO userDTO = authService.selectOne(userId);
        userDTO.setPassword(null);
        userDTO.setRole(null);

        resp.put("userDTO", userDTO);

        return ResponseEntity.ok().body(resp);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> userLogout(){
        System.out.println("Logout");
        ResponseCookie cookie1 = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
        ResponseCookie cookie2 = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie1.toString(), cookie2.toString()).body(null);
    }


    @PostMapping("/reneToken")
    public ResponseEntity<?> reneToken(@CookieValue("refreshToken") String refreshToken) {

        log.info("토큰 재발행");

        boolean isOk = jwtTokenProvider.validateToken(refreshToken);

        Authentication authentication = jwtTokenProvider.getAuthentication(refreshToken);

        if (isOk) {
            log.info("재발행성공");
            JwtTokenDTO jwtTokenDTO = jwtTokenProvider.createToken(authentication);

            ResponseCookie cookie1 = ResponseCookie.from("accessToken", jwtTokenDTO.getAccessToken())
                    .httpOnly(true)
                    .path("/")
                    .maxAge(Duration.ofDays(1))
                    .build();

            ResponseCookie cookie2 = ResponseCookie.from("refreshToken", jwtTokenDTO.getRefreshToken())
                    .httpOnly(true)
                    .path("/")
                    .maxAge(Duration.ofDays(1))
                    .build();

            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie1.toString(), cookie2.toString()).body(null);
        }
        return ResponseEntity.badRequest().body(null);
    }

    @PostMapping("/unLink")
    public ResponseEntity<?> UnLink(@RequestBody @Validated SocialLinkDTO socialLinkDTO) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        socialLinkDTO.setUserId(authentication.getName());
        boolean isOk = authService.unSocialLink(socialLinkDTO);

        if(!isOk){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        return ResponseEntity.ok().body(null);
    }

    @PostMapping("/kakaoLink")
    public ResponseEntity<?> kakaoLink(@RequestBody Map<String, Object> req) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Map<String,Object> resp = new HashMap<>();

        String code = (String) req.get("code");
        String redirect_url = ((String) req.get("url")).split("&")[0];

        ResponseEntity<KakaoDTO> oauthResponse = authService.kakaoOauth(code,redirect_url);

        ResponseEntity<KakaoDTO> kakaoUserInfoResponse = authService.getUserKakaoId(oauthResponse.getBody().access_token);

        String userId = authentication.getName();
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

    @PostMapping("/naverLink")
    public ResponseEntity<?> naverLink(@RequestBody Map<String, Object> req) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Map<String,Object> resp = new HashMap<>();

        String code = (String) req.get("code");
        String redirect_url = ((String) req.get("url")).split("&")[0];

        ResponseEntity<NaverDTO> oauthResponse = authService.naverOauth(code,redirect_url);

        ResponseEntity<NaverDTO> naverUserInfoResponse = authService.getUserNaverId(oauthResponse.getBody().access_token);

        String userId = authentication.getName();
        String linkedID = naverUserInfoResponse.getBody().getResponse().getId();
        String email = naverUserInfoResponse.getBody().getResponse().getEmail();

        SocialLinkDTO socialLinkDTO = SocialLinkDTO.builder()
                .userId(userId)
                .platformType("1")
                .linkedId(linkedID)
                .email(email)
                .build();

        List<SocialLinkDTO> socialLinkDTO1  = (List<SocialLinkDTO>)userService.searchUserAccountLink(socialLinkDTO).get("socialLinkDTO");
        if(socialLinkDTO1.size() > 0) {
            resp.put("FailCode","1");
            resp.put("success",false);
            return ResponseEntity.ok().body(resp);
        }

        boolean isAdded = authService.addSocialLink(socialLinkDTO);

        resp.put("success",true);
        return ResponseEntity.ok().body(resp);
    }

    @PostMapping("/googleLink")
    public ResponseEntity<?> googleLink(@RequestBody Map<String, Object> req) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Map<String,Object> resp = new HashMap<>();

        String code = (String) req.get("code");
        String redirect_url = ((String) req.get("url")).split("&")[0];
        log.info(code);
        log.info(redirect_url);

        ResponseEntity<GoogleDTO> oauthResponse = authService.googleOauth(code, redirect_url);
//        log.info("구글 DTO {}",oauthResponse.getBody().getAccess_token());

        ResponseEntity<GoogleDTO> googleUserInfoResponse = authService.getUserGoogleId(oauthResponse.getBody().getAccess_token());
//        log.info("구글 유저정보{}", String.valueOf(googleUserInfoResponse));

        SocialLinkDTO socialLinkDTO = SocialLinkDTO.builder()
                .userId(authentication.getName())
                .platformType("3")
                .linkedId(googleUserInfoResponse.getBody().getId())
                .email(googleUserInfoResponse.getBody().getEmail())
                .build();

        List<SocialLinkDTO> socialLinkDTO1  = (List<SocialLinkDTO>)userService.searchUserAccountLink(socialLinkDTO).get("socialLinkDTO");
        if(socialLinkDTO1.size() > 0) {
            resp.put("FailCode","1");
            resp.put("success",false);
            return ResponseEntity.ok().body(resp);
        }

        boolean isAdded = authService.addSocialLink(socialLinkDTO);

        resp.put("success",true);
        return ResponseEntity.ok().body(resp);
    }
}
