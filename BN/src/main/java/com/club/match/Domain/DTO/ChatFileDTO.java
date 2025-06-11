package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ChatFileDTO {
    private String postAttachmentId;
    private String messageId;
    private String attachmentUrl;
    private String originalFileName;
    private String contentType;
}
