package com.club.match.Controller;


import com.club.match.Domain.DTO.PageDTO;
import com.club.match.Domain.Service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    AdminService adminService;
    
    @PostMapping("/users")
    public ResponseEntity<Map<String, Object>> getBooks(@Validated PageDTO pageDTO) {

        Map<String, Object> resp;

        log.info("PageDTO : " + pageDTO);

        resp = adminService.allUserSelect(pageDTO);

        log.info("data : " + resp.get("data"));

        resp.put("chartData", adminService.registCount());

        return ResponseEntity.ok().body(resp);
    }

}
