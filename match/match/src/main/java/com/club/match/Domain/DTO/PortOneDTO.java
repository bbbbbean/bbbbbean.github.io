package com.club.match.Domain.DTO;

import com.fasterxml.jackson.core.Base64Variant;
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
    public static class Response{
        private String access_token;
        private String phone;
        private String name;
        private String gender;
        private LocalDate birthday;
    }

}
