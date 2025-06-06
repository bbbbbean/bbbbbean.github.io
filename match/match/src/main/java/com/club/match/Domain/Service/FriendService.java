package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.FriendDTO;
import com.club.match.Domain.DTO.UserDTO;
import com.club.match.Mapper.FriendMapper;
import com.club.match.Mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class FriendService {

    private final FriendMapper friendMapper;

    private final UserMapper userMapper;

    public UserDTO findFriendById(String userId) {
        return friendMapper.findUserById(userId);
    }

    @Transactional
    public boolean addFriend(FriendDTO dto) {
        // 이미 친구 요청이나 친구 관계가 존재하는지 체크
        int count1 = friendMapper.existsFriendRequest(dto.getUserId(), dto.getFriendId());
        int count2 = friendMapper.existsFriendRequest(dto.getFriendId(), dto.getUserId());

        if (count1 + count2 > 0)
            return false;

        // 친구 요청 추가
        return friendMapper.insertFriendRequest(dto) > 0;
    }

    // 받은 사람 입장에서 수락 대기 중인 친구 요청 조회
    public List<UserDTO> getFriendRequests(String friendId) {
        List<FriendDTO> friendDTOList = friendMapper.findRequestsByFriendId(friendId);
        List<UserDTO> userDTOList = new ArrayList<>();
        for(FriendDTO friendDTO : friendDTOList){
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

    //친구 삭제
    @Transactional
    public boolean removeFriend(FriendDTO friendDTO) {
        return friendMapper.deleteFriend(friendDTO) > 0;
    }

    @Transactional
    public boolean acceptFriend(FriendDTO dto) {

        // 상태를 0으로 변경 (친구 상태로)
        boolean update = friendMapper.updateFriendStatus(dto.getUserId(), dto.getFriendId(), 0) > 0;

        // 상대방 → 나 방향의 관계가 없다면 insert (친구 요청 기록이 없으면 추가)
        int existsReverse = friendMapper.existsFriendRequest(dto.getFriendId(), dto.getUserId());
        if (existsReverse == 0) {
            FriendDTO reverseDto = new FriendDTO();
            reverseDto.setUserId(dto.getFriendId());
            reverseDto.setFriendId(dto.getUserId());
            reverseDto.setStatus(0);
            friendMapper.insertFriendRequest(reverseDto);
        }

        return update;
    }

    //친구 목록 조회
    public List<UserDTO> getFriendList(String userId, int status) {
        List<FriendDTO> friendDTOList = friendMapper.getFriendList(userId, status);
        List<UserDTO> userDTOList = new ArrayList<>();
        for(FriendDTO friendDTO : friendDTOList){
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
        int result = friendMapper.updateStatus(dto.getUserId(), dto.getFriendId(), dto.getStatus());
        return result > 0;
    }

    @Transactional
    public boolean rejectFriend(FriendDTO dto) {
        // 요청 거절: DB에서 해당 요청 삭제
        return friendMapper.deleteFriendRequest(dto.getUserId(), dto.getFriendId()) > 0;
    }
    //유저 찾기
    public List<UserDTO> findFriendByNickName(String nickName) {
        List<UserDTO> userDTOList = friendMapper.findUserByNickName(nickName);
        log.info("userDTOList : " + userDTOList);
        List<UserDTO> userDTOList1 = new ArrayList<>();
        for(UserDTO userDTO : userDTOList){
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
