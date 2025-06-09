package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class NotificationDTO {
    private String notificationId;
    private String content;
    private LocalDateTime receivedAt;
    private LocalDateTime readAt;
    private String userId;
    private String type;
    private String time;
    private int notificationCode;
}
