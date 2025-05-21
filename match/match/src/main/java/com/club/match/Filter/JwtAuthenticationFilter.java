package com.club.match.Filter;

import com.club.match.Config.auth.provider.JwtTokenProvider;
import com.club.match.Config.Handler.Exception.TokenException;
import com.nimbusds.oauth2.sdk.http.HTTPRequest;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.util.Enumeration;
import java.util.Locale;

@Component
@Slf4j
public class JwtAuthenticationFilter extends GenericFilterBean {

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String token = resolveToken((HttpServletRequest) servletRequest);

        try {
            if(token != null && jwtTokenProvider.validateToken(token)){
                Authentication authentication = jwtTokenProvider.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            filterChain.doFilter(servletRequest,servletResponse);
        } catch (TokenException e) {
            log.warn("JWT 인증 실패: {}", e.getMessage());
            setErrorResponse(response, e.getMessage());
        }

    }

    private void setErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");

        String body = String.format("{\"type\":\"JWT\", \"message\":\"%s\"}", message);
        response.getWriter().write(body);
    }

    private String resolveToken(HttpServletRequest req){
        Cookie[] cookies = req.getCookies();

        String bearerToken = "";

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    bearerToken = cookie.getValue();
                }
            }
        }
        if(StringUtils.hasText(bearerToken)){
            return bearerToken;
        }
        return null;
    }
}
