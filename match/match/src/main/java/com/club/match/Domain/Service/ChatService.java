package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.*;
import com.club.match.Mapper.ChatMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Slf4j
public class ChatService {

    @Autowired
    ChatMapper chatMapper;

    @Value("${server.url}")
    private String BASE_URL;

    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> chatRoomSearch(String userId) {
        Map<String,Object> resp = new HashMap<>();
        // 1대1 챗 가져오기
        List<String> friendChat = chatMapper.selectAllChat(userId, 0);
        System.out.println(friendChat);
        List<ChatRoomDTO> chatFriendRoomDTOs = new ArrayList<>();
        for(String chatCode : friendChat){
            ChatRoomDTO chatRoomDTO = chatMapper.selectChatFriendRoom(userId,chatCode);
            chatRoomDTO.setImageUrl(BASE_URL + "profile/"+chatRoomDTO.getUserId());
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


        List<ChatRoomDTO> chatGroupRoomDTOs = new ArrayList<>();
        for(String chatCode : groupChat){
            ChatRoomDTO chatRoomDTO = chatMapper.selectChatGroupRoom(userId,chatCode);
            chatRoomDTO.setImageUrl(BASE_URL + "profile/"+chatRoomDTO.getUserId());
            if(chatRoomDTO.getLastMessage() == null || chatRoomDTO.getLastMessageAt().isBefore(chatRoomDTO.getUserCreateAt())){
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
        } else { // 그룹채팅
            // 안 읽은 메시지 추출
            List<String> list = chatMapper.getUnreadGroupMessages(userId,chatCode);

            // chatreceiver_tbl에 메시지 읽음 처리
            int count=0;
            for(String messageId : list){
                count += chatMapper.insertReceivChatMessage(userId, messageId);
            }
            boolean isOk = (list.size() == count);
            return isOk;
        }
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
                if(!(messageDTO.getUserId().equals(userId) && messageDTO.getIsRead() == 0)){
                    messageDTO.setIsRead(0);
                } else {
                    messageDTO.setIsRead(1);
                }
                //파일이면 해당 파일 url주소와 파일명 전송
                if(messageDTO.getIsFile() == 1){
                    ChatFileDTO chatFileDTO = chatMapper.getChatFile(messageDTO.getMessageId());
                    messageDTO.setContent(chatFileDTO.getAttachmentUrl());
                    messageDTO.setFileName(chatFileDTO.getOriginalFileName());
                    messageDTO.setFileType(chatFileDTO.getContentType());
                }
            }

            RespMessageDTO reactMessageDTO = RespMessageDTO.builder()
                    .title(userDTO.getNickName())
                    .mainImage(BASE_URL+"profile/"+userDTO.getUserId())
                    .messages(messageDTOs)
                    .userCount(0)
                    .build();

            resp.put("data", reactMessageDTO);

        } else { // 그룹채팅
            // 채팅 정보 추출
            ChatRoomDTO chatRoomDTO = chatMapper.selectChatGroupRoom(userId,chatCode);
            // 그룹 총 참여자수 추출
            int userCount = chatMapper.countRoomMember(chatCode);
            // 이전 채팅 가져오기
            List<MessageDTO> messageDTOs = chatMapper.selectAllMessage(chatCode, userId);
            for(MessageDTO messageDTO : messageDTOs){
                // isRead가 0 -> 안읽은 사람이 있다
                if(messageDTO.getIsRead() == 0) {
                    // 총읽은수체크
                    int readCount = chatMapper.countReceivChatMessage(messageDTO.getMessageId());
                    // 참여자 수 X 읽은수 있는 참여자 수
                    // 해당 메시지를 읽을 수 있는 참여자 수 체크
                    int readableCount = chatMapper.countReadableParticipants(chatCode,messageDTO.getMessageId());
                    // 다 읽었을 경우 해당 메시지 읽음 처리
                    if(readableCount == readCount){
                        chatMapper.markFriendMessagesAsReadOne(messageDTO.getMessageId(), userId);
                        // 다 읽은 메시지 receive 삭제
                        chatMapper.removeReceive(messageDTO.getMessageId());
                    }
                    messageDTO.setIsRead(readableCount-readCount);
                } else { // 다읽었다
                    messageDTO.setIsRead(0);
                }
                //파일이면 해당 파일 url주소와 파일명 전송
                if(messageDTO.getIsFile() == 1){
                    ChatFileDTO chatFileDTO = chatMapper.getChatFile(messageDTO.getMessageId());
                    messageDTO.setContent(chatFileDTO.getAttachmentUrl());
                    messageDTO.setFileName(chatFileDTO.getOriginalFileName());
                    messageDTO.setFileType(chatFileDTO.getContentType());
                }
            }

            RespMessageDTO reactMessageDTO = RespMessageDTO.builder()
                    .title(chatRoomDTO.getNickName())                                    //###################### 임시 챗 타이틀 vs 매칭 제목
                    .mainImage(BASE_URL+"profile/"+chatRoomDTO.getUserId()) //###################### 매칭 생성 유저 프로필 vs 매칭에서 프로필 등록
                    .messages(messageDTOs)
                    .userCount(userCount)
                    .build();

            resp.put("data", reactMessageDTO);
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
    @Transactional(rollbackFor = Exception.class)
    public void readMessage(String chatCode, String messageId, String userId) {
        // 그룹 채팅인지 1대1 채팅인지 확인
        int type = chatMapper.selectChatType(chatCode);
        if(type == 0){ // 1대1 채팅
            chatMapper.markFriendMessagesAsReadOne(messageId, userId);
        } else { // 그룹채팅
            chatMapper.insertReceivChatMessage(userId,messageId);
        }
    }
    @Transactional(rollbackFor = Exception.class)
    public int getRoomMemberCount(String chatCode) {
        return chatMapper.countRoomMember(chatCode);
    }

    @Transactional(rollbackFor = Exception.class)
    public List<String> getParticipantUsers(String chatCode) {return chatMapper.participantUsers(chatCode);}


    @Transactional(rollbackFor = Exception.class)
    public boolean addFileChat(MessageDTO messageDTO) {
        return chatMapper.insertFileChatMessage(messageDTO) > 0;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean saveFile(ChatFileDTO fileDTO) {
        return chatMapper.insertChatFile(fileDTO) > 0;
    }

    public List<String> allUser(String chatCode) {
        return chatMapper.allUser(chatCode);
    }
}
