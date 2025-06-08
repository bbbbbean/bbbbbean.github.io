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
public class MatchDto {
    private long matchId;
    private String creatorId;
    private String title;
    private LocalDateTime createAt;
    private LocalDateTime startTime;
    private String status;
    private String location;
    private String url;
    private int anonymousCondi;
    private int mannerCondi;
    private String genderCondi;
    private int chatCode;

    private List<String> tag;
}
