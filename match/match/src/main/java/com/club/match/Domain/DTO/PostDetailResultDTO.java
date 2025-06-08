package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostDetailResultDTO {
    private Long postId;
    private String userId;
    private String nickName;
    private String title;
    private String content;
    private LocalDateTime createAt;
    private Integer viewCount;
    private Integer postCodeId;
    private String postCategory;
    private Integer likeCount;
    private Integer dislikeCount;
}
