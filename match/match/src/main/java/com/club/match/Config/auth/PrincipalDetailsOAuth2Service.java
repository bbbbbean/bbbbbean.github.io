package com.club.match.Config.auth;

import com.club.match.Config.auth.provider.KakaoUserInfo;
import com.club.match.Config.auth.provider.NaverUserInfo;
import com.club.match.Config.auth.provider.OAuth2UserInfo;
import com.club.match.Domain.DTO.SocialLinkDTO;
import com.club.match.Domain.DTO.UserDTO;
import com.club.match.Mapper.UserMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;


@Service
@Slf4j
public class PrincipalDetailsOAuth2Service extends DefaultOAuth2UserService {

    @Autowired
    UserMapper userMapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("PrincipalDetailsOAuth2Service's loadUser invoke..");

        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();

        System.out.println(request.getRequestURI());

        //OAuth2UserInfo
        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println("oAuth2User : " + oAuth2User);
        System.out.println("getAttributes : " + oAuth2User.getAttributes());

        Map<String,Object> attributes = oAuth2User.getAttributes();

        OAuth2UserInfo oAuth2UserInfo = null;

        if(request.getRequestURI().contains("naver")){
            
            //네이버 로그인시
            Map<String, String> response = (Map<String, String>) attributes.get("response");
            String id = response.get("id");
            String email = response.get("email");
            oAuth2UserInfo = new NaverUserInfo(id,email);

        } else if(request.getRequestURI().contains("kakao")) {

            //카카오 로그인시
            Long id = (Long)attributes.get("id");
            LocalDateTime connected_at = OffsetDateTime.parse( attributes.get("connected_at").toString() ).toLocalDateTime();
            Map<String,Object> properties = (Map<String,Object>)attributes.get("properties");
            Map<String,Object> kakao_account = (Map<String,Object>) attributes.get("kakao_account");
            oAuth2UserInfo = new KakaoUserInfo(id,connected_at,properties,kakao_account);


        } else if(request.getRequestURI().contains("google")) {

            //구글 로그인시
            String id = attributes.get("id").toString();

        }

        System.out.println("oAuth2UserInfo : " + oAuth2UserInfo.getProvider());

        List<SocialLinkDTO> socialLinkDTO = userMapper.userLinkAt(SocialLinkDTO.builder()
                        .platformType(oAuth2UserInfo.getProvider())
                        .linkedId(oAuth2UserInfo.getProviderId())
                .build());

        if(socialLinkDTO.size() == 0){
            throw new OAuth2AuthenticationException("a");
        }

        UserDTO userDTO = userMapper.selectAt(socialLinkDTO.get(0).getUserId());
        userDTO.setPlatform(oAuth2UserInfo.getProvider());
        userDTO.setRole("ROLE_"+userDTO.getRole());

        return new PrincipalDetails(userDTO);
    }
}
