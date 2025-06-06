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
public class CalendarDto {
    private long matchId;
    private String userId;

    // 내용 추가를 위한 제목, 날짜
    private String title;
    private LocalDateTime startTime;
}
