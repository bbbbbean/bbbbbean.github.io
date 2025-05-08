package com.club.match.Mapper;

import com.club.match.Domain.DTO.UserDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.Optional;

@Mapper
public interface UserMapper {
    public UserDTO selectAt(String userId);
}
