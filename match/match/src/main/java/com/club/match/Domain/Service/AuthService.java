package com.club.match.Domain.Service;

import com.club.match.Component.JwtTokenProvider;
import com.club.match.Domain.DTO.JwtTokenDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@Slf4j
public class AuthService {

    @Autowired
    AuthenticationManagerBuilder authenticationManagerBuilder;

    @Autowired
    JwtTokenProvider jwtTokenProvider;


    @Transactional
    public JwtTokenDTO login(String userId, String password){
        UsernamePasswordAuthenticationToken authenticationToken = new
                UsernamePasswordAuthenticationToken(userId,password);

        Authentication authentication =
                authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        JwtTokenDTO jwtTokenDTO = jwtTokenProvider.createToken(authentication);

        return jwtTokenDTO;
    }
}
