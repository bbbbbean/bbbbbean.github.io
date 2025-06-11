package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.LineChartDTO;
import com.club.match.Domain.DTO.PageDTO;
import com.club.match.Domain.DTO.UserDTO;
import com.club.match.Mapper.AdminMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class AdminService {

    @Autowired
    AdminMapper adminMapper;

    public Map<String,Object> allUserSelect(PageDTO pageDTO) {
        Map<String,Object> resp = new HashMap<>();

        pageDTO.setStart((pageDTO.getPage()-1)* pageDTO.getPerPage());

        if(pageDTO.getField().equals("id")){
            pageDTO.setField("userId");
        }

        if(pageDTO.getField().equals("private")){
            pageDTO.setField("isPrivate");
        }

        if(pageDTO.getField().equals("gender")){
            if(pageDTO.getFilter().contains("남")){
                pageDTO.setFilter("male");
            } else if(pageDTO.getFilter().contains("여")){
                pageDTO.setFilter("female");
            } else {
                pageDTO.setFilter("");
            }
        }

        List<UserDTO> list = adminMapper.selectAllUser(pageDTO);

        list.forEach(userDTO -> {
            System.out.println(userDTO.getGender());
            System.out.println(userDTO.getGender().equals("male"));
            if(userDTO.getGender().equals("male")){
                userDTO.setGender("남자");
            } else {
                userDTO.setGender("여자");
            }
        });

        resp.put("data", list);

        int total = adminMapper.allUserCount();

        resp.put("total", total);

        return resp;
    }

    public Map<String,Object> registCount() {
        Map<String,Object> resp = new HashMap<>();
        List<LineChartDTO> list = adminMapper.registCount();
        resp.put("data", list);
        resp.put("id","일별 가입자 수");
        log.info("List : " + list);
        return resp;
    }
}
