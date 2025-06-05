package com.club.match.Mapper;

import com.club.match.Domain.DTO.AttachmentFileDTO;
import com.club.match.Domain.DTO.PostDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PostMapper {
    int insertPost(PostDTO postDTO);

    PostDTO selectPostByPostId(Long postId);

    String selectContentByPostId(Long postId);

    Long getPostId(PostDTO postDTO);

    int deletePost(Long postId);
}
