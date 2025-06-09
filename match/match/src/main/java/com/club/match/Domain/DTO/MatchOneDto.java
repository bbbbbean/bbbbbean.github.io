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
public class MatchOneDto {
    // matchId로 정보 조회 - matchId, title, people, condis, kategorie, startTime, location, creatorId(nickname), chatId, status
    private long matchId;
    private String title;
    private LocalDateTime startTime;
    private int status;
    private String location;
    private int anonymousCondi;
    private String genderCondi;
    private int chatCode;
    private int people;
    private int kategorie;
    private String nickName;
}
