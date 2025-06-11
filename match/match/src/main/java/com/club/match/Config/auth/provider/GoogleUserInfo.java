package com.club.match.Config.auth.provider;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@AllArgsConstructor
public class GoogleUserInfo implements OAuth2UserInfo{
    @Override
    public String getName() {
        return "";
    }

    @Override
    public String getEmail() {
        return "";
    }

    @Override
    public String getProvider() {
        return "";
    }

    @Override
    public String getProviderId() {
        return "";
    }

    @Override
    public Map<String, Object> getAttributes() {
        return Map.of();
    }
//    private Long id;
//    private LocalDateTime created_at;
//    private Map<String,Object> properties;
//    private Map<String,Object> google_account;
//
//    @Override
//    public String getName() {
//        return id;
//    }
//
//    @Override
//    public String getEmail() {
//        return email;
//    }
//
//    @Override
//    public String getProvider() {
//        return "3";
//    }
}
