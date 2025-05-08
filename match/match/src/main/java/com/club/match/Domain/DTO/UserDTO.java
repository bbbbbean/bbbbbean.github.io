package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Blob;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private String userId;
    private String password;
    private String name;
    private String nickName;
    private Integer gender;
    private String email;
    private String phone;
    private String address;
    private Byte[] profile;
    private Integer manner;
    private String introduction;
    private Integer points;
    private boolean isPrivate;
    private String role;
}
