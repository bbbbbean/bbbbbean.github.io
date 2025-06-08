package com.club.match.Mapper;

import com.club.match.Domain.DTO.AttachmentFileDTO;
import com.club.match.Domain.DTO.PostDTO;
import com.club.match.Domain.DTO.PostDetailResultDTO;
import com.club.match.Domain.DTO.PostRecommendationDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PostMapper {
    // INSERT
    int insertPost(PostDTO postDTO);

    int insertPostRecommendation(PostRecommendationDTO postRecommendationDTO);

    // SELECT
    PostDetailResultDTO selectPostByPostId(Long postId);

    List<AttachmentFileDTO> selectAttachmentsByPostId(Long postId);

    PostRecommendationDTO selectPostRecommendationByUserIdAndPostId(@Param("postId") Long postId, @Param("userId") String userId);

    // UPDATE
    void incrementViewCount(Long postId);

    int incrementLikeCount(Long postId);

    int decrementLikeCount(Long postId);

    int incrementDislikeCount(Long postId);

    int decrementDislikeCount(Long postId);

    // DELETE
    int deletePost(Long postId);

    int deletePostRecommendation(@Param("postId") Long postId, @Param("userId") String userId);

}
