package com.club.match.Mapper;

import com.club.match.Domain.DTO.FriendDTO;
import com.club.match.Domain.DTO.UserDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FriendMapper {

    int existsFriendRequest(@Param("userId") String userId, @Param("friendId") String friendId);

    int insertFriendRequest(FriendDTO dto);

    int deleteFriend(FriendDTO friendDTO);

    UserDTO findUserById(@Param("userId") String userId);

    List<UserDTO> findUserByNickName(String nickName);

    List<FriendDTO> findRequestsByFriendId(@Param("friendId") String friendId);

    // 단방향 상태 업데이트 (즐겨찾기/차단)
    int updateFriendStatusOneWay(@Param("userId") String userId,
                                 @Param("friendId") String friendId,
                                 @Param("status") int status);

    // 양방향 상태 업데이트 (친구 수락 등)
    int updateFriendStatusBothWay(@Param("userId") String userId,
                                  @Param("friendId") String friendId,
                                  @Param("status") int status);

    int deleteFriendRequest(@Param("userId") String userId, @Param("friendId") String friendId);

    List<FriendDTO> getFriendList(@Param("userId") String userId, @Param("status") int status);

    int insertFriend(@Param("userId") String userId,
                     @Param("friendId") String friendId,
                     @Param("status") int status);
}
