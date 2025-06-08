package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ChattingDto {
    private long chatCode;
    private int type;
    private String hostId;
    private String chatTitle;
}
