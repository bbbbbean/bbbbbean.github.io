package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PortOneDTO {
    private Response response;

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class Response {
        private String access_token;
        private LocalDate birthday;
        private String gender;
        private String name;
        private String origin;
        private String phone;
    }
}
