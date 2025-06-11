package com.club.match.Config.Handler;

import java.io.IOException;
import java.time.Duration;

import com.club.match.Config.auth.PrincipalDetails;
import com.club.match.Config.auth.provider.JwtTokenProvider;
import com.club.match.Domain.DTO.JwtTokenDTO;
import com.club.match.Domain.DTO.UserDTO;
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
        System.out.println("LoginSuccess" + auth);
        log.info("auth.getPrincipal()" + auth.getPrincipal());

        UserDTO userDTO = (UserDTO) ((PrincipalDetails) auth.getPrincipal()).getUserDto();
        String platform = userDTO.getPlatform();

        JwtTokenDTO jwtTokenDTO = jwtTokenProvider.createToken(auth);

        long maxAge = Duration.ofDays(1).getSeconds();

        // Set-Cookie 직접 설정 (HttpOnly, Secure, SameSite=None)
        resp.addHeader("Set-Cookie", "accessToken=" + jwtTokenDTO.getAccessToken() +
                "; Max-Age=" + maxAge +
                "; Path=/" +
                "; HttpOnly" +
                "; Secure" +
                "; SameSite=None");

        resp.addHeader("Set-Cookie", "refreshToken=" + jwtTokenDTO.getRefreshToken() +
                "; Max-Age=" + maxAge +
                "; Path=/" +
                "; HttpOnly" +
                "; Secure" +
                "; SameSite=None");

        // 기존 JSESSIONID 제거
        resp.addHeader("Set-Cookie", "JSESSIONID=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=None");

        // 세션 무효화
        HttpSession session = req.getSession(false);
        if (session != null) session.invalidate();

        // 리다이렉트
        resp.sendRedirect(url + "/oauth2/" + platform);
    }
}
