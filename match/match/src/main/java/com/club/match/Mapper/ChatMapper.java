package com.club.match.Mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChatMapper {
    List<String> selectAllChat(String userId, long type);
}
