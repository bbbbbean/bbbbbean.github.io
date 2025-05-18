package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SignDTO {
    private String imp_uid;
    private boolean idCheck;
    private boolean authCheck;
    private String userId;
    private String nickName;
    private String password;
    private String repassword;

}
