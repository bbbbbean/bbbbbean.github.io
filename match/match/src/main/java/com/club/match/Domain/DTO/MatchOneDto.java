package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class MatchOneDto {
    private long matchId;
    private String userId;
    private String nickName;
    private String gender;
    private int anonymousCondi;
    private int genderCondi;
    private int chatCode;
    private String location;
    private LocalDateTime startTime;
    private String title;
    private List<String> tags;
    private int people;
    private int countPeople;
    private int status;
    private int kategorie;
}
