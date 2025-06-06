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

    List<FriendDTO> findRequestsByFriendId(@Param("friendId") String friendId);

    int updateFriendStatus(@Param("userId") String userId,
                           @Param("friendId") String friendId,
                           @Param("status") int status);
    int deleteFriendRequest(@Param("userId") String userId, @Param("friendId") String friendId);

    List<FriendDTO> getFriendList(@Param("userId") String userId, int status);

    List<UserDTO> findUserByNickName(String nickName);
}
