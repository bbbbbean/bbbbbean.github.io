package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class MatchListDto {
    private long matchId;
    private LocalDateTime startTime;
    private String title;
    private List<String> tags;
    private int people;
    private int countPeople;
    private int status;
}
