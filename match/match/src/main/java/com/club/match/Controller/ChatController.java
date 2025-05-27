package com.club.match.Controller;

import com.club.match.Config.auth.PrincipalDetails;
import com.club.match.Domain.DTO.ChatDTO;
import com.club.match.Domain.DTO.MessageDTO;
import com.club.match.Domain.DTO.RespMessageDTO;
import com.club.match.Domain.Service.ChatService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpSession;
import org.springframework.messaging.simp.user.SimpSubscription;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    ChatService chatService;

    @Autowired
    private SimpUserRegistry simpUserRegistry;

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

    @PostMapping("/getChatMessage")
    public ResponseEntity<?> getChattingMessage(@RequestBody Map<String,Object> req){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String chatCode = (String)req.get("chatCode");

        String userId = authentication.getName();
        Map<String,Object> resp = chatService.chatMessage(chatCode, userId);

        return ResponseEntity.ok().body(resp);
    }

    @PostMapping("readChat")
    public ResponseEntity<?> readChat(@RequestBody Map<String,Object> req){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String chatCode = (String)req.get("chatCode");
        Long messageId = ((Integer) req.get("messageId")).longValue();
        String userId = authentication.getName();

        chatService.readMessage(chatCode,messageId,userId);

        return ResponseEntity.ok().body(null);
    }

    @MessageMapping("/enter")
    public void chatRoomEnter(ChatDTO chatDTO, Principal principal) {
        String userId = principal.getName();
        String destination = "/sub/room/" + chatDTO.getRoomId();
        // 읽음 알림 전송
        template.convertAndSend(destination, "ok");
    }

    @MessageMapping("/message")
    public void send(ChatDTO chatDTO, Principal principal) {

        String destination = "/sub/room/" + chatDTO.getRoomId();

        String userId = principal.getName();
        String nickName = chatService.getNickName(userId);
        MessageDTO messageDTO = MessageDTO.builder()
                .chatCode(chatDTO.getRoomId())
                .userId(userId)
                .nickName(nickName)
                .content(chatDTO.getContent())
                .createAt(LocalDateTime.now())
                .isRead(0)
                .isFile(0)
                .build();
        //DB에 메시지 저장후 다시 가져오기 -> 메시지 아이디 전송을 위해
        boolean isOk = chatService.addChatMessage(messageDTO);

        if(isOk){
            MessageDTO respMessageDTO = chatService.getNewChatMessage(messageDTO);

            //채팅방 인원수 체크
            int roomMemberCount = chatService.getRoomMemberCount(String.valueOf(chatDTO.getRoomId()));
            respMessageDTO.setIsRead(roomMemberCount);

            //현재 구독 인원수 체크
            log.info("sub : " + simpUserRegistry.getUsers());
            int count = 0;
            for (SimpUser user : simpUserRegistry.getUsers()) {
                for (SimpSession session : user.getSessions()) {
                    for (SimpSubscription subscription : session.getSubscriptions()) {
                        if (destination.equals(subscription.getDestination())) {
                            count++;
                            break;
                        }
                    }
                }
            }
            respMessageDTO.setSubscriberCount(count);

            template.convertAndSend(destination, respMessageDTO);
        }
        // 구독중인 모든 사용자에게 메시지를 전달합니다.
    }
}
