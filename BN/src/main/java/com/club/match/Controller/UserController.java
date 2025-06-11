package com.club.match.Controller;

import com.club.match.Config.auth.PrincipalDetails;
import com.club.match.Domain.DTO.PrevMatchDto;
import com.club.match.Domain.DTO.SocialLinkDTO;
import com.club.match.Domain.DTO.UserBookMarkDTO;
import com.club.match.Domain.DTO.UserDTO;
import com.club.match.Domain.Service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLIntegrityConstraintViolationException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping("/myInfoPwdCheck")
    public ResponseEntity<?> pwdCheck(@RequestBody Map<String, Object> req) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> resp = new HashMap<>();
        String userId = (String)authentication.getName();
        String password = (String) req.get("password");
        UserDTO userDTO = userService.serchUserOne(userId);
        boolean isOk = passwordEncoder.matches(password, userDTO.getPassword());
        resp.put("success", isOk);
        if (!isOk) {
            resp.put("message", "비밀번호가 일치하지 않습니다");
        }
        return ResponseEntity.ok().body(resp);
    }

    @PostMapping("/getTag")
    public ResponseEntity<?> getTag(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userId = authentication.getName();

        Map<String,Object> tagsResp = userService.serchUserTag(userId);

        return ResponseEntity.ok().body(tagsResp);
    }

    @PostMapping("/addTag")
    public ResponseEntity<?> addTag(@RequestBody Map<String, Object> req){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userId = authentication.getName();
        String tag = (String)req.get("tag");
        Map<String,Object> tagsResp = new HashMap<>();
        try{
            tagsResp = userService.addUserTag(userId, tag);
        } catch (DataAccessException e){
            if(e instanceof DuplicateKeyException){
                tagsResp.put("error","중복된 태그값이 존재합니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(tagsResp);
            }
        }

        return ResponseEntity.ok().body(tagsResp);
    }

    @PostMapping("/delTag")
    public ResponseEntity<?> delTag(@RequestBody Map<String, Object> req){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userId = authentication.getName();
        String tag = (String)req.get("tag");

        Map<String,Object> tagsResp = userService.delUserTag(userId, tag);

        return ResponseEntity.ok().body(tagsResp);
    }

    @PostMapping("/getAccountLink")
    public ResponseEntity<?> getAccountLink(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userId = authentication.getName();

        Map<String, Object> resp = userService.searchUserAccountLink(SocialLinkDTO
                .builder()
                .platformType("0")
                .userId(userId)
                .build());


        return ResponseEntity.ok().body(resp);
    }
    
    @PostMapping("infoUpdate")
    public ResponseEntity<?> infoUpdate(@RequestBody Map<String, Object> req){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String nickNameRegex = "^.{2,10}$";
        String introductionRegex = "^.{1,40}$";

        Map<String, Object> resp = new HashMap<>();

        UserDTO userDTO = null;

        String userId = authentication.getName();
        String value = (String)req.get("value");

        if(value.trim().isEmpty()){
            resp.put("error","값을 입력해주세요");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        String type = (String)req.get("type");

        if(type.equals("nickname")){
            if(!value.matches(nickNameRegex)){
                resp.put("error","닉네임은 2~10글자 사이여야합니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
            };
        } else if(type.equals("introduction")) {
            if(!value.matches(introductionRegex)){
                resp.put("error","소개글은 최대 40글자 입니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
            };
        }

        if(type.equals("isPrivate")){
            int isOk = userService.matchPartiCheck(userId);
            if(isOk > 0){
                resp.put("error","비공개로 전환하려면 실명매칭을 취소해야합니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
            }
        }


        if(type.equals("phone")) {
            log.info("폰번호 변경");
        } else { // 나머지
            boolean isOk = userService.changeUserInfo(userId,value,type);
        }

        userDTO = userService.serchUserOne(userId);
        userDTO.setPassword("");
        userDTO.setRole("");

        resp.put("userDTO",userDTO);
        return ResponseEntity.ok().body(resp);
    }

    @PostMapping("updateImg")
    public ResponseEntity<?> updateImg(@RequestParam("image") MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userId = authentication.getName();

        if(file==null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        List<String> IMAGE_EXTENSION = Arrays.asList("jpg", "jpeg", "png", "gif", "webp");
        String fileExtension = file.getContentType().split("/")[1];

        boolean isExtension = false;
        for(String item:IMAGE_EXTENSION){
            if(fileExtension.equals(item)){
                isExtension = !isExtension;
                break;
            }
        }
        if(!isExtension){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        Path userPath = Paths.get("src/main/resources/Users/" + userId + "/profile");
        File userDir = new File(userPath+"");
        File userFile = new File(userPath+"/profile."+fileExtension);
        try {
            FileUtils.cleanDirectory(userDir);
            FileUtils.copyInputStreamToFile(file.getInputStream(),userFile);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok().body(null);
    }

    @PostMapping("passwordUpdate")
    public ResponseEntity<?> passwordUpdate(@RequestBody Map<String, Object> req){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String regex1 = "^(?=.*[a-zA-Z]).+$"; // 영문자 포함
        String regex2 = "^(?=.*[!@#$%^*+=-]).+$"; // 특수문자 포함
        String regex3 = "^(?=.*[0-9]).+$"; // 숫자 포함
        String regex4 = "^.{8,15}$"; // 길이 8~15자

        String curpassword = (String)req.get("curpassword");
        String newpassword = (String)req.get("newpassword");
        String chkpassword = (String)req.get("chkpassword");

        Map<String, Object> resp = new HashMap<>();

        String userId = authentication.getName();

        UserDTO userDTO = userService.serchUserOne(userId);

        boolean isOk = passwordEncoder.matches(curpassword, userDTO.getPassword());

        if(!isOk) {
            resp.put("code", "1");
            resp.put("error", "사용중인 비밀번호가 일치하지 않습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        if(!newpassword.equals(chkpassword)){
            resp.put("code", "2");
            resp.put("error","새로운 비밀번호와 확인이 일치하지 않습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }
        if(passwordEncoder.matches(newpassword,userDTO.getPassword())){
            resp.put("code", "3");
            resp.put("error","이미 사용중인 비밀번호입니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        if (!newpassword.matches(regex1)) {
            resp.put("code","3");
            resp.put("error","비밀번호는 영어가 포함되어야 합니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else if (!newpassword.matches(regex2)) {
            resp.put("code","3");
            resp.put("error","비밀번호는 특수문자가 포함되어야 합니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else if (!newpassword.matches(regex3)) {
            resp.put("code","3");
            resp.put("error","비밀번호는 숫자가 포함되어야 합니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        } else if (!newpassword.matches(regex4)) {
            resp.put("code","3");
            resp.put("error", "비밀번호는 8~15자 사이여야 합니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        String password = passwordEncoder.encode(newpassword);

        boolean isChange = userService.changeUserPassword(userId,password);
        if(!isChange){
            resp.put("error","비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        return ResponseEntity.ok().body(resp);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())){
            return new ResponseEntity<>("로그인된 사용자 정보가 없습니다.", HttpStatus.UNAUTHORIZED);
        }

        String userId = null;
        Object principal = authentication.getPrincipal();

        if (principal instanceof PrincipalDetails) {
            PrincipalDetails principalDetails = (PrincipalDetails) principal;
            userId = principalDetails.getUsername(); // PrincipalDetails의 getUsername()은 userId를 반환하도록 설정되어 있음
        } else if (principal instanceof String) {
            userId = (String) principal;
        } else {
            log.warn("Unknown principal type: {}", principal.getClass().getName());
            return new ResponseEntity<>("알 수 없는 사용자 유형입니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (userId != null) {
            Map<String, String> response = new HashMap<>();
            response.put("userId", userId);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("사용자 ID를 가져올 수 없습니다.", HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping("/bookMark")
    public ResponseEntity<?> bookMark(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        LocalDateTime now = LocalDateTime.now();
        List<UserBookMarkDTO> list = userService.getAllBookMark(now,userId);
        return ResponseEntity.ok().body(list);
    }
    @PostMapping("/prevMatch")
    public ResponseEntity<?> prevMatch() {
        // 지난 매치 들고오기, match status 3
        // userid 기준 : 참가 매치, 매치 전체 목록 join 조회 -> 이중 status=3, 참가 아이디 = userId인 목록 조회 후 출력
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        List<PrevMatchDto> list = userService.prevMatchSelectAll(userId);


        return ResponseEntity.ok().body(list);
    }
    @PostMapping("/information")
    public ResponseEntity<?> information(@RequestBody UserDTO reqUserDTO){

        UserDTO userDTO = userService.serchUserOne(reqUserDTO.getUserId());

        Map<String, Object> resp = userService.serchUserTag(reqUserDTO.getUserId());

        LocalDate birthday = userDTO.getBirthday();
        String month = String.format("%02d", birthday.getMonthValue());
        String day = String.format("%02d", birthday.getDayOfMonth());
        
        if(userDTO.getGender().equals("male")){
            userDTO.setGender("남자");
        } else {
            userDTO.setGender("여자");
        }

        UserDTO respUserDTO;

        if(userDTO.isPrivate()){ // 공개

            respUserDTO = UserDTO.builder()
                    .nickName(userDTO.getNickName())
                    .userId(userDTO.getUserId())
                    .introduction(userDTO.getIntroduction())
                    .name(userDTO.getName())
                    .gender(userDTO.getGender())
                    .birthdayMonth(month)
                    .birthdayDay(day)
                    .profile(userDTO.getProfile())
                    .address(userDTO.getAddress())
                    .build();
        } else { // 비공개
             respUserDTO = UserDTO.builder()
                    .nickName(userDTO.getNickName())
                    .userId(userDTO.getUserId())
                    .introduction(userDTO.getIntroduction())
                    .address(userDTO.getAddress())
                     .profile(userDTO.getProfile())
                    .build();
        }

        resp.put("userInfo", respUserDTO);

        return ResponseEntity.ok().body(resp);
    }
}

