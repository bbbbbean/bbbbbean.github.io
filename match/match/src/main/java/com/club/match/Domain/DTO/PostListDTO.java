package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostListDTO {
    private Long postId;
    private String title;
    private int likeCount;
    private int dislikeCount;
    private int viewCount;
    private String nickName;
    private LocalDateTime createAt;
}
