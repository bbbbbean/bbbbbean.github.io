package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CalendarMemoDTO {
    private long calendarId;
    private String content;
    private LocalDate date;
    private String userId;
}
