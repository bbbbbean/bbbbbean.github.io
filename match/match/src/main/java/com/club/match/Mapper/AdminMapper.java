package com.club.match.Mapper;

import com.club.match.Domain.DTO.LineChartDTO;
import com.club.match.Domain.DTO.PageDTO;
import com.club.match.Domain.DTO.UserDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminMapper {
    public List<UserDTO> selectAllUser(PageDTO pageDTO);

    public int allUserCount();

    public List<LineChartDTO> registCount();
}
