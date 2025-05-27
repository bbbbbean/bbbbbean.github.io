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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class ChatService {

    @Autowired
    ChatMapper chatMapper;

    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> chatRoomSearch(String userId) {
        Map<String,Object> resp = new HashMap<>();
        List<String> friendChat = chatMapper.selectAllChat(userId, 0);
        System.out.println(friendChat);
        List<ChatRoomDTO> chatRoomDTOs = new ArrayList<>();
        for(String chatCode : friendChat){
            ChatRoomDTO chatRoomDTO = chatMapper.selectChatFriendRoom(userId,chatCode);
            chatRoomDTO.setImageUrl("http://localhost:8100/profile/"+chatRoomDTO.getUserId());
            chatRoomDTOs.add(chatRoomDTO);
        }
        List<String> groupChat = chatMapper.selectAllChat(userId, 1);
        resp.put("friendChat", chatRoomDTOs);
        resp.put("groupChat", groupChat);

        return resp;
    }

    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> chatMessage(String chatCode, String userId) {
        Map<String,Object> resp = new HashMap<>();

        // 그룹 채팅인지 1대1 채팅인지 확인
        int type = chatMapper.selectChatType(chatCode);
        if(type == 0){ // 1대1 채팅
            // 상대 유저 정보 추출
            UserDTO userDTO = chatMapper.selectOneUser(userId);
            // 이전 채팅 가져오기
            List<MessageDTO> messageDTOs = chatMapper.selectAllMessage(chatCode, userId);
            for(MessageDTO messageDTO : messageDTOs){
                // 들어가면서 메시지를 모두 읽게됨으로 isRead 0 처리
                messageDTO.setIsRead(0);
            }

            RespMessageDTO reactMessageDTO = RespMessageDTO.builder()
                    .title(userDTO.getNickName())
                    .mainImage("http://localhost:8100/profile/"+userDTO.getUserId())
                    .messages(messageDTOs)
                    .userCount(0)
                    .build();

            resp.put("data", reactMessageDTO);
            
            // 메시지 읽음 처리 -> 상대 메시지를 읽음으로 userId를 넣어야함
            boolean isOk = chatMapper.markFriendMessagesAsRead(userDTO.getUserId(), chatCode) > 0;

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
