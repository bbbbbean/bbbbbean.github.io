package com.club.match.Domain.Service;

import com.club.match.Component.JwtTokenProvider;
import com.club.match.Config.auth.PrincipalDetailsService;
import com.club.match.Domain.DTO.JwtTokenDTO;
import com.club.match.Domain.DTO.SocialLinkDTO;
import com.club.match.Domain.DTO.UserDTO;
import com.club.match.Mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(readOnly = true)
@Slf4j
public class AuthService {

    @Autowired
    AuthenticationManagerBuilder authenticationManagerBuilder;

    @Autowired
    PrincipalDetailsService principalDetailsService;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    UserMapper userMapper;


    @Transactional(rollbackFor = Exception.class)
    public JwtTokenDTO login(String userId, String password){
        UsernamePasswordAuthenticationToken authenticationToken = new
                UsernamePasswordAuthenticationToken(userId,password);

        Authentication authentication =
                authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        JwtTokenDTO jwtTokenDTO = jwtTokenProvider.createToken(authentication);

        return jwtTokenDTO;
    }

    @Transactional(rollbackFor = Exception.class)
    public UserDTO selectOne(String userId){
        UserDTO userDTO = userMapper.selectAt(userId);
        return userDTO;
    }

    @Transactional(rollbackFor = Exception.class)
    public Map<String,Object> socialLogin(SocialLinkDTO socialLinkDTO){
        Map<String,Object> resp = new HashMap<>();
        SocialLinkDTO respSocialLinkDTO = userMapper.userLinkAt(socialLinkDTO);
        UserDTO userDTO = userMapper.selectAt(respSocialLinkDTO.getUserId());
        log.info("값 : " + respSocialLinkDTO.getUserId());
        UserDetails userDetails = User.builder()
                .username(userDTO.getUserId())
                .password("")
                .roles(userDTO.getRole())
                .build();
        log.info("값 : " + userDetails);
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        JwtTokenDTO jwtTokenDTO = jwtTokenProvider.createToken(authenticationToken);

        resp.put("jwtTokenDTO", jwtTokenDTO);
        resp.put("userDTO", userDTO);

        return resp;
    }


}
