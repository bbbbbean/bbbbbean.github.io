package com.club.match.Mapper;

import com.club.match.Domain.DTO.SocialLinkDTO;
import com.club.match.Domain.DTO.UserDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {
    int insertUser(UserDTO userDTO);

    int deleteUser(String userId);

    UserDTO selectAt(String userId);

    List<String> selectUserTag(String userId);

    int selectUserPhone(String phone);

    int updateUserInfo(String userId, String value, String type);

    int updateUserPassword(String userId, String password);

    List<SocialLinkDTO> userLinkAt(SocialLinkDTO socialLinkDTO);

    int insertUserTag(String userId, String tag);

    int insertSocialLink(SocialLinkDTO socialLinkDTO);

    int deleteSocialLink(SocialLinkDTO socialLinkDTO);

    int deleteUserTag(String userId, String tag);
}
