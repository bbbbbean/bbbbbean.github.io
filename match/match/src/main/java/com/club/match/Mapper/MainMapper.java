package com.club.match.Mapper;

import com.club.match.Domain.DTO.TagDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MainMapper {

    List<TagDTO> getTopTags(@Param("limit") int limit);
}
