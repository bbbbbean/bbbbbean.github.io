package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ChatRoomDTO {
    private long chatCode;
    private String nickName;
    private String lastMessage;
    private int unreadCount;
    private String imageUrl;
    private String userId;
}
