package com.club.match.Controller;

import com.club.match.Domain.DTO.CommentDTO;
import com.club.match.Mapper.ChatMapper;
import com.club.match.Mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
public class CommentController {

    @Autowired
    ChatMapper chatMapper;

    @PostMapping("/add/comment")
    public ResponseEntity<?> addComment(@RequestBody CommentDTO commentDTO){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        String nickName = chatMapper.selectGetNickName(userId);
        commentDTO.setCreateAt(LocalDateTime.now());
        commentDTO.setUserId(userId);
        commentDTO.setNickName(nickName);
        log.info("a : " + commentDTO);
        chatMapper.insertComment(commentDTO);
        return ResponseEntity.ok().body(null);
    }
    @PostMapping("/get/comment")
    public ResponseEntity<?> getComment(@RequestBody Map<String,String> req){

        Map<String,Object> resp = new HashMap<>();

        String postId = (String)req.get("postId");

        log.info("postId : " + postId);

        // 부모댓글 추출
        List<CommentDTO> commentDTOs = chatMapper.getParentComment(postId);

        log.info("commentDTOs : " + commentDTOs);

        // 자식댓글 추출
        for(CommentDTO commentDTO : commentDTOs){
            List<CommentDTO> childComment = chatMapper.getChildComment(commentDTO.getCommentId());
            commentDTO.setCommentDTOs(childComment);
        }
        resp.put("commentDTOs",commentDTOs);

        return ResponseEntity.ok().body(resp);
    }
}
