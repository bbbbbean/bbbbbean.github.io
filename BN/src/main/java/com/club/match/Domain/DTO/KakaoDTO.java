package com.club.match.Domain.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class KakaoDTO {
    private String id;
    private KakaoAccountDTO kakao_account;
    public String token_type;
    public String access_token;
    public String id_token;
    public Integer expires_in;
    public String refresh_token;
    public Integer refresh_token_expires_in;
    public String scope;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class KakaoAccountDTO {
        private String email;
    }
}