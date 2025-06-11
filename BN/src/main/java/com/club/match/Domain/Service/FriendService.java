package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.ChatParticipantDto;
import com.club.match.Domain.DTO.ChattingDto;
import com.club.match.Domain.DTO.FriendDTO;
import com.club.match.Domain.DTO.UserDTO;
import com.club.match.Mapper.ChatMapper;
import com.club.match.Mapper.FriendMapper;
import com.club.match.Mapper.MatchMapper;
import com.club.match.Mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class FriendService {

    private final FriendMapper friendMapper;
    private final UserMapper userMapper;
    private final MatchMapper matchMapper;
    private final ChatMapper chatMapper;

    public UserDTO findFriendById(String userId) {
        return friendMapper.findUserById(userId);
    }

    @Transactional
    public boolean addFriend(FriendDTO dto) {
        if (friendMapper.existsFriendRequest(dto.getUserId(), dto.getFriendId()) > 0 ||
                friendMapper.existsFriendRequest(dto.getFriendId(), dto.getUserId()) > 0) {
            return false;
        }

        dto.setStatus(3);
        return friendMapper.insertFriendRequest(dto) > 0;
    }

    @Transactional
    public boolean acceptFriend(FriendDTO dto) {
        // 1. 요청 받은 사람: 상태 변경 (양방향)
        int updateResult = friendMapper.updateFriendStatusBothWay(dto.getFriendId(), dto.getUserId(), 0);
        // 2. 요청 보낸 사람: 새로운 행 추가
        int insertResult = friendMapper.insertFriend(dto.getUserId(), dto.getFriendId(), 0);

        ChattingDto chattingDto = ChattingDto.builder()
                .type(0)
                .build();

        matchMapper.insertChatting(chattingDto);

        matchMapper.insertChatparticipant(ChatParticipantDto.builder()
                        .chatCode(String.valueOf(chattingDto.getChatCode()))
                        .createAt(LocalDateTime.now())
                        .userId(dto.getUserId())
                .build());

        matchMapper.insertChatparticipant(ChatParticipantDto.builder()
                .chatCode(String.valueOf(chattingDto.getChatCode()))
                .createAt(LocalDateTime.now())
                .userId(dto.getFriendId())
                .build());

        return updateResult > 0 && insertResult > 0;
    }

    public List<UserDTO> getFriendRequests(String friendId) {
        List<FriendDTO> friendDTOList = friendMapper.findRequestsByFriendId(friendId);
        List<UserDTO> userDTOList = new ArrayList<>();
        for (FriendDTO friendDTO : friendDTOList) {
            UserDTO userDTO = userMapper.selectAt(friendDTO.getUserId());
            userDTOList.add(UserDTO.builder()
                    .userId(userDTO.getUserId())
                    .introduction(userDTO.getIntroduction())
                    .nickName(userDTO.getNickName())
                    .profile(userDTO.getProfile())
                    .build());
        }
        return userDTOList;
    }

    @Transactional
    public boolean deleteFriend(FriendDTO friendDTO) {
        boolean deleted = friendMapper.deleteFriend(friendDTO) > 0;

        if (deleted) {
            List<String> userIds = List.of(friendDTO.getUserId(), friendDTO.getFriendId());
            int type = 0; // 1:1 채팅방 타입

            String chatCode = chatMapper.findOneToOneChatCode(userIds, type);

            if (chatCode != null && !chatCode.isEmpty()) {
                chatMapper.deleteChatParticipants(chatCode);
                chatMapper.deleteChat(chatCode);
            }
        }

        return deleted;
    }


    public List<UserDTO> getFriendList(String userId, int status) {
        List<FriendDTO> friendDTOList = friendMapper.getFriendList(userId, status);
        List<UserDTO> userDTOList = new ArrayList<>();
        for (FriendDTO friendDTO : friendDTOList) {
            UserDTO userDTO = userMapper.selectAt(friendDTO.getFriendId());
            userDTOList.add(UserDTO.builder()
                    .userId(userDTO.getUserId())
                    .profile(userDTO.getProfile())
                    .nickName(userDTO.getNickName())
                    .introduction(userDTO.getIntroduction())
                    .build());
        }
        return userDTOList;
    }

    public boolean updateFriendStatus(FriendDTO dto) {
        // 로그인한 사용자 기준으로만 업데이트 (단방향)
        int result = friendMapper.updateFriendStatusOneWay(dto.getUserId(), dto.getFriendId(), dto.getStatus());

        if (result == 0) {
            log.warn("즐겨찾기 상태 변경 실패 - 대상 행 없음: userId={}, friendId={}", dto.getUserId(), dto.getFriendId());
        }

        return result > 0;
    }

    @Transactional
    public boolean rejectFriend(FriendDTO dto) {
        return friendMapper.deleteFriendRequest(dto.getUserId(), dto.getFriendId()) > 0;
    }

    public List<UserDTO> findFriendByNickName(String nickName, String userId) {
        List<UserDTO> userDTOList = friendMapper.findUserByNickName(nickName, userId);
        log.info("userDTOList : " + userDTOList);
        List<UserDTO> userDTOList1 = new ArrayList<>();
        for (UserDTO userDTO : userDTOList) {
            userDTOList1.add(UserDTO.builder()
                    .userId(userDTO.getUserId())
                    .profile(userDTO.getProfile())
                    .nickName(userDTO.getNickName())
                    .introduction(userDTO.getIntroduction())
                    .build());
        }
        return userDTOList1;
    }
}
