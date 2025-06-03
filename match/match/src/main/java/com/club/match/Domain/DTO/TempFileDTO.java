package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TempFileDTO {
    private Long postId = 0L;
    private String attachmentUrl;
    private String originalFileName;
    private String contentType;
}
