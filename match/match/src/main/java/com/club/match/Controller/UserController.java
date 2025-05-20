package com.club.match.Controller;

import com.club.match.Domain.DTO.SocialLinkDTO;
import com.club.match.Domain.DTO.UserDTO;
import com.club.match.Domain.Service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
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
        Map<String, Object> resp = new HashMap<>();
        String userId = (String) req.get("userId");
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
    public ResponseEntity<?> getTag(@RequestBody Map<String, Object> req){

        String userId = (String)req.get("userId");

        Map<String,Object> tagsResp = userService.serchUserTag(userId);

        return ResponseEntity.ok().body(tagsResp);
    }

    @PostMapping("/addTag")
    public ResponseEntity<?> addTag(@RequestBody Map<String, Object> req){

        String userId = (String)req.get("userId");
        String tag = (String)req.get("tag");

        Map<String,Object> tagsResp = userService.addUserTag(userId, tag);

        return ResponseEntity.ok().body(tagsResp);
    }

    @PostMapping("/delTag")
    public ResponseEntity<?> delTag(@RequestBody Map<String, Object> req){

        String userId = (String)req.get("userId");
        String tag = (String)req.get("tag");

        Map<String,Object> tagsResp = userService.delUserTag(userId, tag);

        return ResponseEntity.ok().body(tagsResp);
    }

    @PostMapping("/getAccountLink")
    public ResponseEntity<?> getAccountLink(@RequestBody Map<String, Object> req){

        String userId = (String)req.get("userId");

        Map<String, Object> resp = userService.searchUserAccountLink(SocialLinkDTO
                .builder()
                .platformType("0")
                .userId(userId)
                .build());


        return ResponseEntity.ok().body(resp);
    }
    @PostMapping("infoUpdate")
    public ResponseEntity<?> infoUpdate(@RequestBody Map<String, Object> req){

        Map<String, Object> resp = new HashMap<>();

        UserDTO userDTO = null;

        String userId = (String)req.get("userId");
        String value = (String)req.get("value");
        String type = (String)req.get("type");

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
    public ResponseEntity<?> updateImg(@RequestParam("image") MultipartFile file,
                                       @RequestParam("userId") String userId) {

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


        String curpassword = (String)req.get("curpassword");
        String newpassword = (String)req.get("newpassword");
        String chkpassword = (String)req.get("chkpassword");

        Map<String, Object> resp = new HashMap<>();

        String userId = (String)req.get("userId");

        UserDTO userDTO = userService.serchUserOne(userId);

        boolean isOk = passwordEncoder.matches(curpassword, userDTO.getPassword());

        if(!isOk){
            resp.put("code","1");//사용중인 비밀번호가 일치하지 않습니다.
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }
        if(!newpassword.equals(chkpassword)){
            resp.put("code","2");//새로운 비밀번호와 확인이 일치하지 않습니다.
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }
        if(passwordEncoder.matches(newpassword,userDTO.getPassword())){
            resp.put("code","3");//이미 사용중인 비밀번호입니다.
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        String password = passwordEncoder.encode(newpassword);

        boolean isChange = userService.changeUserPassword(userId,password);
        if(isChange){
            resp.put("code","4");//비밀번호 변경에 실패했습니다. 다시 입력해주세요.
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resp);
        }

        return ResponseEntity.ok().body(resp);
    }
}

