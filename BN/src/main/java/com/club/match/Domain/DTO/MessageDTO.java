package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class MessageDTO {
    private String messageId;
    private String chatCode;
    private int subscriberCount;
    private String userId;
    private String nickName;
    private String fileName;
    private String fileType;
    private String content;
    private LocalDateTime createAt;
    private int isRead;
    private int isFile;
}
