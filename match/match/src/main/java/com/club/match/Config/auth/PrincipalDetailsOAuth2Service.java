package com.club.match.Config.auth;

import com.club.match.Config.auth.provider.KakaoUserInfo;
import com.club.match.Config.auth.provider.OAuth2UserInfo;
import com.club.match.Domain.DTO.SocialLinkDTO;
import com.club.match.Domain.DTO.UserDTO;
import com.club.match.Mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;


@Service
public class PrincipalDetailsOAuth2Service extends DefaultOAuth2UserService {

    @Autowired
    UserMapper userMapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("PrincipalDetailsOAuth2Service's loadUser invoke..");

        //OAuth2UserInfo
        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println("oAuth2User : " + oAuth2User);
        System.out.println("getAttributes : " + oAuth2User.getAttributes());

        OAuth2UserInfo oAuth2UserInfo = null;

        //카카오 로그인시
        Map<String,Object> attributes = oAuth2User.getAttributes();
        Long id = (Long)attributes.get("id");
        LocalDateTime connected_at = OffsetDateTime.parse( attributes.get("connected_at").toString() ).toLocalDateTime();
        Map<String,Object> properties = (Map<String,Object>)attributes.get("properties");
        Map<String,Object> kakao_account = (Map<String,Object>) attributes.get("kakao_account");
        oAuth2UserInfo = new KakaoUserInfo(id,connected_at,properties,kakao_account);

        System.out.println("oAuth2UserInfo : " + oAuth2UserInfo.getProvider());

        List<SocialLinkDTO> socialLinkDTO = userMapper.userLinkAt(SocialLinkDTO.builder()
                        .platformType(oAuth2UserInfo.getProvider())
                        .linkedId(oAuth2UserInfo.getProviderId())
                .build());

        if(socialLinkDTO.size() == 0){
            throw new OAuth2AuthenticationException("a");
        }

        UserDTO userDTO = userMapper.selectAt(socialLinkDTO.get(0).getUserId());
        userDTO.setRole("ROLE_"+userDTO.getRole());

        return new PrincipalDetails(userDTO);
    }
}
