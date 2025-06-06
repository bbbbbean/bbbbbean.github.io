package com.club.match.Controller;

import com.club.match.Domain.DTO.FriendDTO;
import com.club.match.Domain.DTO.UserDTO;
import com.club.match.Domain.Service.FriendService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/api/friend")
public class FriendController {

    @Autowired
    FriendService friendService;

    //친구 검색(조회) - 1
    @PostMapping("/findFriend")
    public ResponseEntity<?> findFriend(@RequestBody Map<Object, String> req) {
        String nickName = req.get("nickName");
        log.info("a : " + nickName);
        Map<String, Object> resp = new HashMap<>();
        List<UserDTO> userList = friendService.findFriendByNickName(nickName);

        resp.put("friendFind", userList);
        return ResponseEntity.ok().body(resp);

    }

    //친구 요청(요청 생성) - 2
    @PostMapping("/addFriend")
    public ResponseEntity<?> addFriend(@RequestBody FriendDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();  // 로그인한 사용자 ID

        dto.setUserId(userId);  // DTO에 로그인한 사용자 ID 세팅

        boolean result = friendService.addFriend(dto);
        if(result) {
            return ResponseEntity.ok("친구 요청이 성공적으로 전송되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("이미 친구이거나 요청이 존재합니다.");
        }
    }

    //요청 수락시 친구 목록 추가(status 변경 0) - 3
    @PostMapping("/accept")
    public ResponseEntity<String> acceptFriend(@RequestBody FriendDTO dto) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        dto.setUserId(auth.getName());

        boolean result = friendService.acceptFriend(dto);
        return result ? ResponseEntity.ok("친구 요청을 수락했습니다.")
                : ResponseEntity.badRequest().body("수락 실패");
    }

    //요청 거절(DB에서 삭제) - 3
    @PostMapping("/reject")
    public ResponseEntity<String> rejectFriend(@RequestBody FriendDTO dto) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        dto.setUserId(auth.getName());

        boolean result = friendService.rejectFriend(dto);
        return result ? ResponseEntity.ok("친구 요청을 거절했습니다.")
                : ResponseEntity.badRequest().body("거절 실패");
    }

    @PostMapping("/list")
    public ResponseEntity<?> getFriendList() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();

        Map<String,Object> resp = new HashMap<>();

        List<UserDTO> commonFriendList = friendService.getFriendList(userId, 0);
        List<UserDTO> bestFriendList = friendService.getFriendList(userId,1);
        List<UserDTO> friendRequestList = friendService.getFriendRequests(userId);

        resp.put("commonFriend",commonFriendList);
        resp.put("bestFriend", bestFriendList);
        resp.put("friendRequest", friendRequestList);
        return ResponseEntity.ok().body(resp);
    }

    //친구 삭제
    @PostMapping("/deleteFriend")
    public ResponseEntity<?> deleteFriend(@RequestBody @Validated FriendDTO friendDTO) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        friendDTO.setUserId(authentication.getName());
        boolean isOk = friendService.removeFriend(friendDTO);
        if(!isOk){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        return ResponseEntity.ok().body(null);
    }

    //친구 목록
    //요청 수락시 친구 목록 추가(status 변경 0) - 3
    //친구 즐겨찾기(status 변경 1)
    //친구 차단(status 변경 2)
    //기존 친구 목록
    //요청 거절(DB에서 삭제) - 3

}
