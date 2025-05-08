package com.club.match.Component;

import com.club.match.Config.Handler.Exception.TokenException;
import com.club.match.Domain.DTO.JwtTokenDTO;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;


@Slf4j
@Component
public class JwtTokenProvider {

    private final Key key;
    private static final long ACCESS_TOKEN_EXPIRATION_TIME = 1000*10*1;
    private static final long REFRESH_TOKEN_EXPIRATION_TIME = 1000*60*60*24;
    public JwtTokenProvider(@Value("${jwt.secret}") String secretKey) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public JwtTokenDTO createToken(Authentication authentication) {
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).collect(Collectors.joining(","));
        Date now = new Date();
        Date accessExpiration = new Date(now.getTime() + ACCESS_TOKEN_EXPIRATION_TIME);
        Date refreshExpiration = new Date(now.getTime() + REFRESH_TOKEN_EXPIRATION_TIME);
        String userId = authentication.getName();

        String accessToken = Jwts.builder()
                .subject(authentication.getName())
                .claim("auth",authorities)
                .claim("userId", userId)
                .issuedAt(now)
                .expiration(accessExpiration)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        String refreshToken = Jwts.builder()
                .subject(authentication.getName())
                .expiration(refreshExpiration)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        return new JwtTokenDTO("Bearer", refreshToken,accessToken);
    }

    public Authentication getAuthentication(String accessToken) {
        Claims claims = parseClaims(accessToken);

        if(claims.get("auth") == null) {
            throw new RuntimeException("권한이 없는 토큰입니다.");
        }

        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get("auth").toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

        UserDetails principal = new User(claims.getSubject(),"",authorities);
        return new UsernamePasswordAuthenticationToken(principal,"",authorities);
    }

    public boolean validateToken(String token){
        try{
            Jwts.parser()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            throw new TokenException("유효하지 않는 JWT 토큰입니다.", e);
        } catch (ExpiredJwtException e) {
            throw new TokenException("만료된 JWT 토큰입니다.", e);
        } catch (UnsupportedJwtException e) {
            throw new TokenException("지원되지 않는 JWT 토큰입니다.", e);
        } catch (IllegalArgumentException e) {
            throw new TokenException("JWT 클레임 문자열이 비어 있습니다.", e);
        }
    }

    public Claims parseClaims(String accessToken){
        try{
            return Jwts.parser()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(accessToken)
                    .getBody();
        } catch (ExpiredJwtException e){
            return e.getClaims();
        }
    }

}
