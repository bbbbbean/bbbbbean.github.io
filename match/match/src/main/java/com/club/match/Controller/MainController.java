package com.club.match.Controller;

import com.club.match.Domain.DTO.TagDTO;
import com.club.match.Domain.Service.MainService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/main")
public class MainController {

    @Autowired
    MainService mainService;

    @GetMapping("/popular")
    public List<TagDTO> getPopularTags() {
        return mainService.getTopTags(5);  // 기본 5개 반환
    }

}
