package com.club.match.Mapper;

import com.club.match.Domain.DTO.ChatRoomDTO;
import com.club.match.Domain.DTO.MessageDTO;
import com.club.match.Domain.DTO.UserDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChatMapper {
    List<String> selectAllChat(String userId, long type);
    ChatRoomDTO selectChatFriendRoom(String userId, String chatCode);
    int selectChatType(String chatCode);
    UserDTO selectOneUser(String userId);

    List<MessageDTO> selectAllMessage(String chatCode, String userId);

    int markFriendMessagesAsRead(String userId, String chatCode);

    int insertChatMessage(MessageDTO messageDTO);

    MessageDTO selectOneRespMessage(MessageDTO messageDTO);

    String selectGetNickName(String userId);

    int markFriendMessagesAsReadOne(Long messageId, String userId);

    int countRoomMember(String chatCode);
}
