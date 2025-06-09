package com.club.match.Controller;

import com.club.match.Domain.DTO.MatchDto;
import com.club.match.Domain.DTO.TagDTO;
import com.club.match.Domain.Service.MainService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @PostMapping("/matches")
    public ResponseEntity<?> getMatchList(){

        Map<String, Object> resp = new HashMap<>();

        List<MatchDto> matchList = mainService.getMatchList();

        resp.put("matches",matchList);
        return ResponseEntity.ok().body(resp);
    }

    @PostMapping("/random")
    public ResponseEntity<?> getRandomMatchList(){

        Map<String, Object> resp = new HashMap<>();

        List<MatchDto> randomMatchList = mainService.getRandomMatchList();

        resp.put("random",randomMatchList);
        return ResponseEntity.ok().body(resp);
    }

    @PostMapping("/findMatch")
    public ResponseEntity<?> getMatchSearchList(@RequestBody Map<Object, String> req){
        String keyword = req.get("keyword");
        List<MatchDto> matches = mainService.searchMatchesByKeyword(keyword);

        Map<String, Object> resp = new HashMap<>();
        resp.put("matches", matches);
        return ResponseEntity.ok().body(resp);
    }

}
