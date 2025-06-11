package com.club.match.Config.auth.provider;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@AllArgsConstructor
public class GoogleUserInfo implements OAuth2UserInfo{
    private String id;
    private String email;

    @Override
    public String getName() {
        return id;
    }

    @Override
    public String getEmail() {
        return email;
    }

    @Override
    public String getProvider() {
        return "3";
    }

    @Override
    public String getProviderId() {
        return id;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }
}
