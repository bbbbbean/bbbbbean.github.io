package com.club.match.Controller;

import com.club.match.Domain.DTO.ChatDTO;
import com.club.match.Domain.Service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class ChatController {

    @Autowired
    ChatService chatService;

    private final SimpMessagingTemplate template;       // 특정 사용자에게 메시지를 보내는데 사용되는 STOMP을 이용한 템플릿입니다.

    @Autowired
    public ChatController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        Map<String,Object> resp = chatService.subscribeSearch(userId);

        return ResponseEntity.ok().body(resp);
    }
    @MessageMapping("/messages")
    public ChatDTO send(@RequestBody ChatDTO chatDTO) {
        template.convertAndSend("/sub/room/1/message", chatDTO.getContent());       // 구독중인 모든 사용자에게 메시지를 전달합니다.
        return chatDTO;
    }
}
