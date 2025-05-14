package com.club.match.Controller;

import com.club.match.Domain.DTO.SocialLinkDTO;
import com.club.match.Domain.Service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService userService;

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
}
