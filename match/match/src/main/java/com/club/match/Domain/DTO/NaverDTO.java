package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class NaverDTO {
    public String access_token;
    private String resultcode;
    private String message;
    private NaverResponse response;
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class NaverResponse {
        private String id;
        private String email;
    }
}