package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Blob;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private int id;
    private String userId;
    private String password;
    private String name;
    private String nickName;
    private String gender;
    private LocalDate birthday;
    private String phone;
    private String address;
    private String profile;
    private Integer manner;
    private String introduction;
    private Integer points;
    private boolean isPrivate;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate createAt;
    private String platform;
    private String role;
}
