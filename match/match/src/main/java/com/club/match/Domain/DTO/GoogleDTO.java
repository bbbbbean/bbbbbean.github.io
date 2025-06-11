package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoogleDTO {
    private String access_token;
    private String id;
    private String email;
}
