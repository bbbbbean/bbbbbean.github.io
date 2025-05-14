package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.SocialLinkDTO;
import com.club.match.Mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class UserService {

    @Autowired
    UserMapper userMapper;

    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> serchUserTag(String userId) {
        Map<String, Object> resp = new HashMap<>();
        List<String> tags = userMapper.selectUserTag(userId);
        resp.put("tags", tags);
        return resp;
    }

    public Map<String, Object> addUserTag(String userId,String tag) {
        Map<String, Object> resp = new HashMap<>();
        boolean isAdded = userMapper.insertUserTag(userId,tag) > 0;
        List<String> tags = userMapper.selectUserTag(userId);
        resp.put("tags", tags);
        return resp;
    }
    public Map<String, Object> delUserTag(String userId, String tag) {
        Map<String, Object> resp = new HashMap<>();
        boolean isDeled = userMapper.deleteUserTag(userId,tag) > 0;
        List<String> tags = userMapper.selectUserTag(userId);
        resp.put("tags", tags);
        return resp;
    }

    public Map<String, Object> searchUserAccountLink(SocialLinkDTO socialLinkDTO) {
        Map<String, Object> resp = new HashMap<>();
        List<SocialLinkDTO> socialLinkDTOs = userMapper.userLinkAt(socialLinkDTO);
        for (SocialLinkDTO linkDTO : socialLinkDTOs) {
            linkDTO.setLinkedId("");
        }
        resp.put("socialLinkDTO",socialLinkDTOs);
        return resp;
    }


}
