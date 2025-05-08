package com.club.match.Config.Handler;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomLogoutSuccessHandler implements LogoutSuccessHandler{
    
    @Override
    public void onLogoutSuccess(HttpServletRequest req, HttpServletResponse resp, Authentication auth){
        log.info("LOGOUT_SUCCESS");
    }
}
