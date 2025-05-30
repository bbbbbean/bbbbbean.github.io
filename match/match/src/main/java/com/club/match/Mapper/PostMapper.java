package com.club.match.Mapper;

import com.club.match.Domain.DTO.PostDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PostMapper {
    int insertPost(PostDTO postDTO);

    PostDTO selectPostById(Long postId);
}
