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

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    ChatService chatService;

    private final SimpMessagingTemplate template;       // 특정 사용자에게 메시지를 보내는데 사용되는 STOMP을 이용한 템플릿입니다.

    @Autowired
    public ChatController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @PostMapping("/getChatRoom")
    public ResponseEntity<?> searchChatRoom(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        Map<String,Object> resp = chatService.chatRoomSearch(userId);

        return ResponseEntity.ok().body(resp);
    }

    @MessageMapping("/message")
    public void send(ChatDTO chatDTO, Principal principal) {
        System.out.println(principal);
        template.convertAndSend("/sub/room/1", chatDTO);       // 구독중인 모든 사용자에게 메시지를 전달합니다.
    }
}
