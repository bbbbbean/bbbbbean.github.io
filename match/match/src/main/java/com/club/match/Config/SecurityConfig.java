package com.club.match.Config;


import com.club.match.Component.JwtTokenProvider;
import com.club.match.Config.Handler.CustomLoginSuccessHandler;
import com.club.match.Filter.JwtAuthenticationFilter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.List;

@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfig {

    @Autowired
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Bean
    public SecurityFilterChain SecurityFilterChain(HttpSecurity http,@Value("${react.url}") String url) throws Exception {

        http.csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                //.formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable());

        http.authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/api/auth/login","/api/auth/reneToken",
                            "/api/auth/logout").permitAll();
                    auth.requestMatchers("/admin/**").hasRole("ADMIN");
                    auth.requestMatchers("/api/auth/pwdCheck").hasAnyRole("ADMIN","USER");
                    auth.anyRequest().authenticated();
                })
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        http.cors(cors -> cors.configurationSource(corsConfigurationSource(url)));

        http.formLogin((form ) ->{
            form.loginProcessingUrl("/login");
            form.usernameParameter("userId");
            form.successHandler(new CustomLoginSuccessHandler(jwtTokenProvider, url));
        });

        http.oauth2Login((oauth2)->{
            oauth2.loginPage("/login");
            oauth2.successHandler(new CustomLoginSuccessHandler(jwtTokenProvider, url));
        });

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(String url) {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(url));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}