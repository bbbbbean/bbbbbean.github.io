package com.club.match.Config.Handler;

import java.io.IOException;
import java.time.Duration;

import com.club.match.Component.JwtTokenProvider;
import com.club.match.Domain.DTO.JwtTokenDTO;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CustomLoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final String url;

    public CustomLoginSuccessHandler(JwtTokenProvider jwtTokenProvider, @Value("${react.url}") String redirectUrl) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.url = redirectUrl;
    }
    @Override
    public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse resp, Authentication auth) throws IOException {
        System.out.println("");
        JwtTokenDTO jwtTokenDTO = jwtTokenProvider.createToken(auth);
        System.out.println(jwtTokenDTO.getRefreshToken());
        Cookie cookie = new Cookie("refreshToken", jwtTokenDTO.getRefreshToken());
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge((int) Duration.ofDays(1).getSeconds());

        resp.addCookie(cookie);

        resp.sendRedirect(url+"/ok?token="+jwtTokenDTO.getAccessToken());
    }
}
