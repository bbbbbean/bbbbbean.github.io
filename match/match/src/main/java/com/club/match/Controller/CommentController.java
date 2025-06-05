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
import java.time.format.DateTimeFormatter;
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
        if(nickName.equals(commentDTO.getCommentTo())){
            commentDTO.setCommentTo(null);
        }
        log.info("a : " + commentDTO);
        chatMapper.insertComment(commentDTO);
        return ResponseEntity.ok().body(null);
    }

    @PostMapping("/edit/comment")
    public ResponseEntity<?> editComment(@RequestBody CommentDTO commentDTO){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        commentDTO.setUserId(authentication.getName());

        boolean isOk = chatMapper.updateComment(commentDTO) > 0;

        return ResponseEntity.ok().body(null);
    }

    @PostMapping("/del/comment")
    public ResponseEntity<?> delComment(@RequestBody CommentDTO commentDTO){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        commentDTO.setUserId(authentication.getName());

        boolean isDel = chatMapper.deleteComment(commentDTO) > 0;

        if(!isDel){
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(null);
    }

    @PostMapping("/get/comment")
    public ResponseEntity<?> getComment(@RequestBody Map<String,String> req){

        Map<String,Object> resp = new HashMap<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        String postId = (String)req.get("postId");

        log.info("postId : " + postId);
        int total = 0;
        // 부모댓글 추출
        List<CommentDTO> commentDTOs = chatMapper.getParentComment(postId);
        total = total + commentDTOs.size();

        log.info("commentDTOs : " + commentDTOs);

        // 자식댓글 추출
        for(CommentDTO commentDTO : commentDTOs){
            commentDTO.setTime(commentDTO.getCreateAt().format(formatter));
            List<CommentDTO> childComment = chatMapper.getChildComment(commentDTO.getCommentId());
            total = total + childComment.size();
            for(CommentDTO commentDTO2 : childComment){
                commentDTO2.setTime(commentDTO2.getCreateAt().format(formatter));
                if(commentDTO2.getCommentTo() != null){
                    commentDTO2.setContent("<span style=\"color:#F9AF0E;\">@"+commentDTO2.getCommentTo()+"</span><br/>"+commentDTO2.getContent());
                }
            }
            commentDTO.setChildCount(childComment.size());
            commentDTO.setCommentDTOs(childComment);
        }
        resp.put("commentDTOs",commentDTOs);
        resp.put("total",total);

        return ResponseEntity.ok().body(resp);
    }
}
