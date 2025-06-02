package com.club.match.Mapper;

import com.club.match.Domain.DTO.PostDTO;
import org.apache.ibatis.annotations.Mapper;
import org.eclipse.tags.shaded.org.apache.xpath.operations.And;

@Mapper
public interface PostMapper {
    int insertPost(PostDTO postDTO);

    PostDTO selectPostById(Long postId);

    int deletePost(Long postId);

    Long getPostId(PostDTO postDTO);
}
