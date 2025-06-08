package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostRecommendationDTO {
    private Long postRecommendationId;
    private Long postId;
    private String userId;
    private Integer reactionType;
    private LocalDateTime createAt;
}
