package com.club.match.Config.auth;

import com.club.match.Domain.DTO.UserDTO;
import com.club.match.Mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class PrincipalDetailsService implements UserDetailsService {

	@Autowired
	private UserMapper userMapper;
	
	@Override
	public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
		Optional<UserDTO> userDTO = Optional.ofNullable(userMapper.selectAt(userId));
		return userDTO
				.map(this::createUserDetails)
				.orElseThrow(() -> new UsernameNotFoundException(userId + "은 존재하지 않는 계정입니다."));
	}

	private UserDetails createUserDetails(UserDTO userDTO) {
		return User.builder()
				.username(userDTO.getUserId())
				.password(userDTO.getPassword())
				.roles(userDTO.getRole())
				.build();
	}
	
}
