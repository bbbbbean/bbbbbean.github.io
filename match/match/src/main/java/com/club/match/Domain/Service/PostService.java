package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.PostDTO;
import com.club.match.Mapper.PostMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class PostService {

    @Autowired
    private PostMapper postMapper;

    @Transactional(rollbackFor = Exception.class)
    public Map<String,Object> savePost(PostDTO postDTO) {
        Map<String, Object> resp = new HashMap<>();
        try {
            int rowsAffected = postMapper.insertPost(postDTO);
            if (rowsAffected > 0) {
                resp.put("success",true);
                resp.put("message", "게시글이 성공적으로 저장되었습니다.");
                resp.put("postId", postDTO.getPostId());
            } else {
                resp.put("success", false);
                resp.put("message", "게시글 저장에 실패했습니다.");
            }
        } catch (Exception e){
            log.error("게시글 저장 중 오류 발생: {}", e.getMessage(), e);
            resp.put("success", false);
            resp.put("message", "게시글 저장 중 오류가 발생했습니다: " + e.getMessage());
        }
        return resp;
    }
}
