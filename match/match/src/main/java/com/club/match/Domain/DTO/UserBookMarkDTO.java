package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserBookMarkDTO {
    private String matchId;
    private String month;
    private String day;
    private String location;
    private String title;
    private String kategorie;
}
