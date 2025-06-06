package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FriendDTO {
    private String userId;
    private String friendId;
    private int status;


    // 추가 필드 (친구 정보 표시용)
    private String name;
    private String intro;
}
