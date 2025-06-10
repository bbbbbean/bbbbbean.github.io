package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.PrevMatchDto;
import com.club.match.Domain.DTO.SocialLinkDTO;
import com.club.match.Domain.DTO.UserBookMarkDTO;
import com.club.match.Domain.DTO.UserDTO;
import com.club.match.Mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLIntegrityConstraintViolationException;
import java.time.LocalDateTime;
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
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> addUserTag(String userId,String tag) throws DataAccessException {
        Map<String, Object> resp = new HashMap<>();
        boolean isAdded = userMapper.insertUserTag(userId,tag) > 0;
        List<String> tags = userMapper.selectUserTag(userId);
        resp.put("tags", tags);
        return resp;
    }
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> delUserTag(String userId, String tag) {
        Map<String, Object> resp = new HashMap<>();
        boolean isDeled = userMapper.deleteUserTag(userId,tag) > 0;
        List<String> tags = userMapper.selectUserTag(userId);
        resp.put("tags", tags);
        return resp;
    }

    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> searchUserAccountLink(SocialLinkDTO socialLinkDTO) {
        Map<String, Object> resp = new HashMap<>();
        List<SocialLinkDTO> socialLinkDTOs = userMapper.userLinkAt(socialLinkDTO);
        for (SocialLinkDTO linkDTO : socialLinkDTOs) {
            linkDTO.setLinkedId("");
        }
        resp.put("socialLinkDTO",socialLinkDTOs);
        return resp;
    }

    @Transactional(rollbackFor = Exception.class)
    public UserDTO serchUserOne(String userId) {
        UserDTO userDTO = userMapper.selectAt(userId);
        return userDTO;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean changeUserInfo(String userId, String value, String type) {
        boolean isChange = userMapper.updateUserInfo(userId, value, type) > 0;
        return isChange;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean changeUserPassword(String userId, String password) {
        boolean isChange = userMapper.updateUserPassword(userId,password) > 0;
        return isChange;
    }

    @Transactional(rollbackFor = Exception.class)
    public List<UserBookMarkDTO> getAllBookMark(LocalDateTime now, String userId) {
        List<UserBookMarkDTO> list = userMapper.bookMarkSelectAll(now,userId);
        for(UserBookMarkDTO userBookMarkDTO : list){
            switch (userBookMarkDTO.getKategorie()){
                case "1":
                    userBookMarkDTO.setKategorie("운동");
                    break;
                case "2":
                    userBookMarkDTO.setKategorie("여행");
                    break;
                case "3":
                    userBookMarkDTO.setKategorie("게임");
                    break;
                case "4":
                    userBookMarkDTO.setKategorie("기타");
                    break;
            }
        }

        return list;
    }
    @Transactional(rollbackFor = Exception.class)
    public List<PrevMatchDto> prevMatchSelectAll(String userId){
        List<PrevMatchDto> list = userMapper.prevMatchSelectAll(userId);
        return list;
    }
}
