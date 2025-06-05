package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.nio.file.Files;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostDTO {
    private Long postId; // 저장버튼 누르면 자동으로 작성
    private String userId;
    private String title;
    private String content;
    private LocalDateTime createAt;
    private Integer viewCount;
    private Integer postCodeId;
}
