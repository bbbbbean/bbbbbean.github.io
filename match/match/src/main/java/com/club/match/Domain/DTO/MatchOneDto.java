package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class MatchOneDto {
    private long matchId;
    private String nickName;
    private String gender;
    private int anonymousCondi;
    private String genderCondi;
    private int chatCode;
    private String location;
}
