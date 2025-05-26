package com.club.match.Controller;

import com.club.match.Domain.DTO.ChatDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {

    private final SimpMessagingTemplate template;       // 특정 사용자에게 메시지를 보내는데 사용되는 STOMP을 이용한 템플릿입니다.

    @Autowired
    public ChatController(SimpMessagingTemplate template) {
        this.template = template;
    }
    @MessageMapping("/messages")
    public ChatDTO send2(@RequestBody ChatDTO chatDTO) {
        template.convertAndSend("/sub/room/message", chatDTO.getContent());       // 구독중인 모든 사용자에게 메시지를 전달합니다.
        return chatDTO;
    }
}
