package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ChatRoomDTO {
    private String chatCode;
    private String nickName;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private LocalDateTime userCreateAt;
    private int unreadCount;
    private String imageUrl;
    private String userId;
}
