package com.club.match.Config.Handler;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

@Slf4j
public class CustomFailureHandler implements AuthenticationFailureHandler {

    private final String url;

    public CustomFailureHandler(@Value("${react.url}") String redirectUrl) {
        this.url = redirectUrl;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest req, HttpServletResponse resp, AuthenticationException auth) throws IOException {

        resp.sendRedirect(url+"/user/login?errorCode="+2);
    }
}
