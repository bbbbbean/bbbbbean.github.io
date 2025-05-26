package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttachmentFileDTO {
    private Long postAttachmentId;
    private Long postId;
    private String attachmentUrl;
}