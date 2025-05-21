package com.club.match.Config.Handler;

import java.io.IOException;
import java.time.Duration;

import com.club.match.Config.auth.provider.JwtTokenProvider;
import com.club.match.Domain.DTO.JwtTokenDTO;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
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
        Cookie cookie1 = new Cookie("accessToken", jwtTokenDTO.getAccessToken());
        cookie1.setHttpOnly(true);
        cookie1.setPath("/");
        cookie1.setMaxAge((int) Duration.ofDays(1).getSeconds());

        Cookie cookie2 = new Cookie("refreshToken", jwtTokenDTO.getRefreshToken());
        cookie2.setHttpOnly(true);
        cookie2.setPath("/");
        cookie2.setMaxAge((int) Duration.ofDays(1).getSeconds());

        Cookie cookie3 = new Cookie("JSESSIONID", "");
        cookie3.setHttpOnly(true);
        cookie3.setPath("/");
        cookie3.setMaxAge(0);

        resp.addCookie(cookie1);
        resp.addCookie(cookie2);
        resp.addCookie(cookie3);

        HttpSession session =  req.getSession(false);
        if(session!=null)
            session.invalidate();

        resp.sendRedirect(url+"/ok?userId="+auth.getName());
    }
}
