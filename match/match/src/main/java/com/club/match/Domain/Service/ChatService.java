package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.ChatRoomDTO;
import com.club.match.Domain.DTO.MessageDTO;
import com.club.match.Domain.DTO.RespMessageDTO;
import com.club.match.Domain.DTO.UserDTO;
import com.club.match.Mapper.ChatMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class ChatService {

    @Autowired
    ChatMapper chatMapper;

    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> chatRoomSearch(String userId) {
        Map<String,Object> resp = new HashMap<>();
        // 1대1 챗 가져오기
        List<String> friendChat = chatMapper.selectAllChat(userId, 0);
        System.out.println(friendChat);
        List<ChatRoomDTO> chatFriendRoomDTOs = new ArrayList<>();
        for(String chatCode : friendChat){
            ChatRoomDTO chatRoomDTO = chatMapper.selectChatFriendRoom(userId,chatCode);
            chatRoomDTO.setImageUrl("http://localhost:8100/profile/"+chatRoomDTO.getUserId());
            if(chatRoomDTO.getLastMessage() == null){
                chatRoomDTO.setLastMessage("");
            }
            if(chatRoomDTO.getLastMessage().length() >=8){
                chatRoomDTO.setLastMessage(chatRoomDTO.getLastMessage().substring(0,8)+"...");
            }
            chatFriendRoomDTOs.add(chatRoomDTO);
            chatFriendRoomDTOs.sort(
                    Comparator.comparing(ChatRoomDTO::getLastMessageAt, Comparator.nullsLast(Comparator.reverseOrder()))
            );


        }
        // 그룹 챗 가져오기
        List<String> groupChat = chatMapper.selectAllChat(userId, 1);

        log.info("groupChat : " + groupChat);

        List<ChatRoomDTO> chatGroupRoomDTOs = new ArrayList<>();
        for(String chatCode : groupChat){
            ChatRoomDTO chatRoomDTO = chatMapper.selectChatGroupRoom(userId,chatCode);
            log.info("chatRoomDTO : " + chatRoomDTO);
            chatRoomDTO.setImageUrl("http://localhost:8100/profile/"+chatRoomDTO.getUserId());
            if(chatRoomDTO.getLastMessage() == null){
                chatRoomDTO.setLastMessage("");
            }
            if(chatRoomDTO.getLastMessage().length() >=8){
                chatRoomDTO.setLastMessage(chatRoomDTO.getLastMessage().substring(0,8)+"...");
            }
            chatGroupRoomDTOs.add(chatRoomDTO);
            chatGroupRoomDTOs.sort(
                    Comparator.comparing(ChatRoomDTO::getLastMessageAt, Comparator.nullsLast(Comparator.reverseOrder()))
            );
        }

        resp.put("friendChat", chatFriendRoomDTOs);
        resp.put("groupChat", chatGroupRoomDTOs);

        return resp;
    }
    // 메시지 읽음 처리 -> 상대 메시지를 읽음으로 userId를 넣어야함


    @Transactional(rollbackFor = Exception.class)
    public boolean readAllMessage(String chatCode, String userId) {

        // 그룹 채팅인지 1대1 채팅인지 확인
        int type = chatMapper.selectChatType(chatCode);
        if (type == 0) { // 1대1 채팅
            // 상대 유저 정보 추출
            UserDTO userDTO = chatMapper.selectOneUser(chatCode, userId);
            // 메시지 읽음 처리
            boolean isOk = chatMapper.markFriendMessagesAsRead(userDTO.getUserId(), chatCode) > 0;

            return isOk;
        } else {
            List<String> list = chatMapper.getUnreadGroupMessages(userId,chatCode);

            // chatreceiver_tbl에 등록
            for(String messageId : list){
                chatMapper.insertReceivChatMessage(userId,messageId);

            }

            return false;
        } // 그룹채팅

//        그룹 채팅창 오픈 -> 구독 sub/enter ->
//                안읽었던 메시지 모두 읽음처리(chatreceiver_tbl 에 읽은 모든 메시지 저장)
//        if(읽은 후 messageId 별 읽은사람 수 확인 => 그룹 참여자 수와 비교 후 같으면 해당 메시지 isRead 1 로 변경)
//         => 채팅참가 시간과 메시지 수신시간 고려  => 채팅참가 시간 이후 메시지만 비교
//
//        메시지가 프론트로 넘어갈때 -> 그룹 총 참여자 수 - 읽은 사람 수 = 안읽은 사람 수 전달(isRead)
//
//        프론트에 필요한 값
//
//        public class MessageDTO {
//            private long messageId;  => 이전 대화를 불러올때는 불필요 / 실시간에는 필요
//            private long chatCode;   => 0  채팅 코드
//            private int subscriberCount;  => 0 그룹 총인원
//            private String userId;      => ??
//            private String nickName; => 채팅친 유저 닉네임
//            private String content; => 내용
//            private LocalDateTime createAt; => 보낸시간
//            private int isRead; => 안읽은 수
//            private int isFile; = ?? 파일처리
//        }
    }


    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> chatMessage(String chatCode, String userId) {
        Map<String,Object> resp = new HashMap<>();

        // 그룹 채팅인지 1대1 채팅인지 확인
        int type = chatMapper.selectChatType(chatCode);
        if(type == 0){ // 1대1 채팅
            // 상대 유저 정보 추출
            UserDTO userDTO = chatMapper.selectOneUser(chatCode,userId);
            // 이전 채팅 가져오기
            List<MessageDTO> messageDTOs = chatMapper.selectAllMessage(chatCode, userId);
            for(MessageDTO messageDTO : messageDTOs){
                log.info("test : " + messageDTO.getUserId().equals(userId) + (messageDTO.getIsRead() == 0));
                if(!(messageDTO.getUserId().equals(userId) && messageDTO.getIsRead() == 0)){
                    messageDTO.setIsRead(0);
                } else {
                    messageDTO.setIsRead(1);
                }
            }

            RespMessageDTO reactMessageDTO = RespMessageDTO.builder()
                    .title(userDTO.getNickName())
                    .mainImage("http://localhost:8100/profile/"+userDTO.getUserId())
                    .messages(messageDTOs)
                    .userCount(0)
                    .build();

            resp.put("data", reactMessageDTO);

        } else { // 그룹채팅

        }

        return resp;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean addChatMessage(MessageDTO messageDTO) {
        boolean isOk = chatMapper.insertChatMessage(messageDTO) > 0;
        return isOk;
    }
    @Transactional(rollbackFor = Exception.class)
    public MessageDTO getNewChatMessage(MessageDTO messageDTO) {
        return chatMapper.selectOneRespMessage(messageDTO);
    }
    @Transactional(rollbackFor = Exception.class)
    public String getNickName(String userId) {
        return chatMapper.selectGetNickName(userId);
    }
    @Transactional
    public void readMessage(String chatCode, Long messageId, String userId) {
        // 그룹 채팅인지 1대1 채팅인지 확인
        int type = chatMapper.selectChatType(chatCode);
        if(type == 0){ // 1대1 채팅
            chatMapper.markFriendMessagesAsReadOne(messageId, userId);
        } else { // 그룹채팅

        }
    }

    public int getRoomMemberCount(String chatCode) {
        return chatMapper.countRoomMember(chatCode);
    }
}
