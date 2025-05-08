package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtTokenDTO {
    private  String grantType;
    private  String refreshToken;
    private  String accessToken;
}
