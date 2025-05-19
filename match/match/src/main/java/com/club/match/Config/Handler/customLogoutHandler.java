package com.club.match.Config.Handler;

import com.club.match.Config.auth.PrincipalDetails;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;

public class customLogoutHandler implements org.springframework.security.web.authentication.logout.LogoutHandler {
    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        int provider = Integer.parseInt(principalDetails.getUserDto().getPlatform());
        switch (provider){
            case(1):    // 네이버
                break;
            case(2):    // 카카오

                break;
            case(3):    // 구글
                break;
        }
    }
}
