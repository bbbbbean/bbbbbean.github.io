package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.ChatRoomDTO;
import com.club.match.Mapper.ChatMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class ChatService {

    @Autowired
    ChatMapper chatMapper;

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
}
