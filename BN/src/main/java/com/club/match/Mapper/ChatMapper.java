package com.club.match.Mapper;

import com.club.match.Domain.DTO.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChatMapper {
    List<String> selectAllChat(String userId, long type);

    ChatRoomDTO selectChatFriendRoom(String userId, String chatCode);
    ChatRoomDTO selectChatGroupRoom(String userId, String chatCode);

    int selectChatType(String chatCode);

    UserDTO selectOneUser(String chatCode, String userId);

    List<MessageDTO> selectAllMessage(String chatCode, String userId);

    int markFriendMessagesAsRead(String userId, String chatCode);

    int insertChatMessage(MessageDTO messageDTO);

    MessageDTO selectOneRespMessage(MessageDTO messageDTO);

    String selectGetNickName(String userId);

    int markFriendMessagesAsReadOne(String messageId, String userId);

    int countRoomMember(String chatCode);

    List<String> getUnreadGroupMessages(String userId, String chatCode);

    int insertReceivChatMessage(String userId, String messageId);

    int countReceivChatMessage(String messageId);

    int countReadableParticipants(String chatCode, String messageId);

    int removeReceive(String messageId);

    List<String> participantUsers(String chatCode);

    int insertFileChatMessage(MessageDTO messageDTO);

    int insertChatFile(ChatFileDTO fileDTO);

    ChatFileDTO getChatFile(String messageId);

    int insertComment(CommentDTO commentDTO);

    List<CommentDTO> getParentComment(String postId);

    List<CommentDTO> getChildComment(String commentId);

    int updateComment(CommentDTO commentDTO);

    int deleteComment(CommentDTO commentDTO);

    String findOneToOneChatCode(@Param("userIds") List<String> userIds, @Param("type") int type);
    int deleteChatParticipants(@Param("chatCode") String chatCode);
    int deleteChat(@Param("chatCode") String chatCode);


    CommentDTO selectOneComment(String commentId);

    List<String> allUser(String chatCode);
}
