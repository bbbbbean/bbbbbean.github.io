package com.club.match.Controller;

import com.club.match.Domain.DTO.ChatDTO;
import com.club.match.Domain.DTO.ChatFileDTO;
import com.club.match.Domain.DTO.MessageDTO;
import com.club.match.Domain.Service.ChatService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

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
        String messageId = (String) req.get("messageId");
        String userId = authentication.getName();

        chatService.readMessage(chatCode,messageId,userId);

        return ResponseEntity.ok().body(null);
    }

    @PostMapping("fileUpload")
    public ResponseEntity<?> fileUpload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("roomId") String chatCode) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userId = authentication.getName();
        String nickName = chatService.getNickName(userId);
        String contentType = file.getContentType().split("/")[0];
        String originalFileName = file.getOriginalFilename();

        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));

        String fileName = UUID.randomUUID()+fileExtension;

        log.info("fileName : " + fileName);

        if(file==null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        Path userPath = Paths.get("src/main/resources/Users/" + userId + "/chat");
        File userFile = new File(userPath+"/"+fileName);
        try {
            FileUtils.copyInputStreamToFile(file.getInputStream(),userFile);

            MessageDTO messageDTO = MessageDTO.builder()
                .chatCode(chatCode)
                .userId(userId)
                .nickName(nickName)
                .content("FILE")
                .createAt(LocalDateTime.now())
                .isRead(0)
                .isFile(1)
                .build();

            boolean isOk = chatService.addFileChat(messageDTO);
            if(isOk){

                MessageDTO respMessageDTO = chatService.getNewChatMessage(messageDTO);

                ChatFileDTO fileDTO = ChatFileDTO.builder()
                        .messageId(respMessageDTO.getMessageId())
                        .attachmentUrl("http://localhost:8100/chatFile/"+userId+"/"+ fileName+"/"+contentType)
                        .originalFileName(originalFileName)
                        .contentType(contentType)
                        .build();

                boolean isSave = chatService.saveFile(fileDTO);
            }


        } catch (IOException e) {
            e.printStackTrace();
        }
        Map<String,Object> resp = new HashMap<>();
        String destination = "/sub/count/" + chatCode;
        resp.put("isFile","ok");

        template.convertAndSend(destination, resp);

        return ResponseEntity.ok().body(null);
    }

    @MessageMapping("/friend")
    public void addFriend(@RequestBody Map<String,Object> req) throws InterruptedException {
        String friendId = (String) req.get("friendId");
        Map<String,Object> resp = new HashMap<>();

        resp.put("friendAlert","ok");

        template.convertAndSend("/sub/user/"+friendId, resp);
    }

    @MessageMapping("/enter")
    public void chatRoomEnter(ChatDTO chatDTO, Principal principal) throws InterruptedException {
        Map<String,Object> resp = new HashMap<>();
        String destination = "/sub/count/" + chatDTO.getRoomId();
        //채팅 읽음 처리

        boolean isOk = chatService.readAllMessage(chatDTO.getRoomId(),principal.getName());

        resp.put("isOk","ok");

        template.convertAndSend(destination, resp);
    }

    @MessageMapping("/message")
    public void send(ChatDTO chatDTO, Principal principal) {
        log.info("test : "+chatDTO);
        log.info("test : "+chatDTO.getContent());
        log.info("test : "+chatDTO.getFile());

        List<String> Users = chatService.getParticipantUsers(chatDTO.getRoomId());

        String userId = principal.getName();
        String nickName = chatService.getNickName(userId);
        MessageDTO messageDTO = MessageDTO.builder()
                .chatCode(String.valueOf(chatDTO.getRoomId()))
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

            String subCount = "/sub/count/"+chatDTO.getRoomId();

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
                            if (subCount.equals(subscription.getDestination())) {
                                count++;
                                isDuplicate = false;
                                break;
                            }
                        }
                    }
                }
            }
            respMessageDTO.setSubscriberCount(count);

            for(String user : Users){
                template.convertAndSend("/sub/user/"+user, respMessageDTO);
            }

        }
        // 구독중인 모든 사용자에게 메시지를 전달합니다.
    }
}
