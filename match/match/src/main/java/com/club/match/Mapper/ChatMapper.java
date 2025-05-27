package com.club.match.Mapper;

import com.club.match.Domain.DTO.ChatRoomDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChatMapper {
    List<String> selectAllChat(String userId, long type);
    ChatRoomDTO selectChatFriendRoom(String userId, String chatCode);
}
