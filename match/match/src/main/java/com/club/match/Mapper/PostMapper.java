package com.club.match.Mapper;

import com.club.match.Domain.DTO.*;
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

    List<PostListDTO> selectPostList(
            @Param("postCodeId") Long postCodeId,
            @Param("offset") int offset,
            @Param("limit") int limit,
            @Param("searchKeyword") String searchKeyword);

    int countPosts(
            @Param("postCodeId") Long postCodeId,
            @Param("searchKeyword") String searchKeyword
    );

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
