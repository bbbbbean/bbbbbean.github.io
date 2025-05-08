package com.club.match.Controller;

import java.util.HashMap;
import java.util.Map;

import com.club.match.Domain.DTO.JwtTokenDTO;
import com.club.match.Domain.DTO.UserDTO;
import com.club.match.Domain.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthService userService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping("/pwdCheck")
    public ResponseEntity<?> pwdCheck(@RequestBody Map<String,Object> req){
        Map<String, Object> resp = new HashMap<>();
        log.info("PassWord : " + req.get("password"));
        boolean isCheck = req.get("password").equals("test");
        resp.put("success",isCheck);
        return ResponseEntity.ok().body(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<?> userLogin(@RequestBody @Validated UserDTO userDTO) {
        Map<String, Object> resp = new HashMap<>();

        String userId = userDTO.getUserId();
        String password = userDTO.getPassword();
        log.info("request username = {}, password = {}", userId, password);
        JwtTokenDTO jwtTokenDTO = userService.login(userId,password);
        log.info("jwtToken accessToken = {}, refreshToken = {}", jwtTokenDTO.getAccessToken(), jwtTokenDTO.getRefreshToken());

        resp.put("jwtToken", jwtTokenDTO);

        return ResponseEntity.ok().body(resp);
    }
    @PostMapping("/reneToken")
    public ResponseEntity<?> reneToken(@RequestBody Map<String,Object> req){
        Map<String, Object> resp = new HashMap<>();
        return null;
    }
}
