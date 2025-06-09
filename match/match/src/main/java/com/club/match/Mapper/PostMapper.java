package com.club.match.Mapper;

import com.club.match.Domain.DTO.AttachmentFileDTO;
import com.club.match.Domain.DTO.PostDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PostMapper {
    // INSERT
    int insertPost(PostDTO postDTO);

    // SELECT
    PostDTO selectPostByPostId(Long postId);

    List<AttachmentFileDTO> selectAttachmentsByPostId(Long postId);

    // UPDATE
    void incrementViewCount(Long postId);

    // DELETE
    int deletePost(Long postId);

}
