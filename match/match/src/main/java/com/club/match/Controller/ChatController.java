package com.club.match.Controller;

import com.club.match.Config.auth.PrincipalDetails;
import com.club.match.Domain.DTO.ChatDTO;
import com.club.match.Domain.DTO.MessageDTO;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
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
    public ResponseEntity<?> getChattingMessage(@RequestBody Map<String,Object> req) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


        String chatCode = (String)req.get("chatCode");
        String userId = authentication.getName();

        log.info("chatCode : " + chatCode);
        log.info("userId : " + userId);

        // 메시지 가져오기
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
    public void chatRoomEnter(ChatDTO chatDTO, Principal principal) throws InterruptedException {
        Map<String,Object> resp = new HashMap<>();
        String destination = "/sub/room/" + chatDTO.getRoomId();

        //채팅 읽음 처리
        boolean isOk = chatService.readAllMessage(String.valueOf(chatDTO.getRoomId()),principal.getName());

        // 읽음 알림 전송
        resp.put("ok","ok");

        template.convertAndSend(destination, resp);
    }

    @MessageMapping("/message")
    public void send(ChatDTO chatDTO, Principal principal) {

        log.info("test : " + principal);

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
            // 구독 인원 수
            int count = 0;
            for (SimpUser user : simpUserRegistry.getUsers()) {
                // 중복 방지용 변수
                boolean isDuplicate = true;
                for (SimpSession session : user.getSessions()) {
                    if(isDuplicate){
                        for (SimpSubscription subscription : session.getSubscriptions()) {
                            log.info("subscription : " + subscription);
                            if (destination.equals(subscription.getDestination())) {
                                count++;
                                isDuplicate = false;
                                break;
                            }
                        }
                    }
                }
            }
            log.info("count : "+ count);
            respMessageDTO.setSubscriberCount(count);

            template.convertAndSend(destination, respMessageDTO);
        }
        // 구독중인 모든 사용자에게 메시지를 전달합니다.
//        모든유저가 하나의 채널 A에 구독(접속) : 로그인시
//
//        메시지 발생시 해당 메시지 발생지점에 참여자를 뽑아
//
//        A에 트리거 발동 -> 해당 참여들에게만 트리거 전송 후 받은유저는 -> 0.5초동안 메시지가 더이상
//        오지 않을경우 리렌더링(새로고침)
    }
}
