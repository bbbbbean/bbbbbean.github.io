package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CommentDTO {
    private String commentId;
    private String postId;
    private String userId;
    private String nickName;
    private String content;
    private LocalDateTime createAt;
    private String time;
    private String commentTo;
    private String parentId;
    private int ChildCount;
    public List<CommentDTO> commentDTOs;
}
