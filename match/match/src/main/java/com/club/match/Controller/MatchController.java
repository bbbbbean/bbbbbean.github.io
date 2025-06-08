package com.club.match.Controller;

import com.club.match.Domain.DTO.ChattingDto;
import com.club.match.Domain.DTO.MatchDto;
import com.club.match.Domain.Service.MatchService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/match")
@Slf4j
public class MatchController {

    @Autowired
    private MatchService matchService;

    @PostMapping("/list/newMatch")
    public ResponseEntity<?> matchNew(@RequestBody @Validated MatchDto matchDto, @RequestParam("tags") List<String> tags){

        //List<String> tag = (List<String>) resp.get("tags");

        log.info("a : " + tags);


        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String)authentication.getName();
        LocalDateTime createAt = LocalDateTime.now();
        String status = "0";
        String url = "서버주소:포트/"+ UUID.randomUUID().toString().substring(0,8);

        matchDto.setCreatorId(userId);
        matchDto.setCreateAt(createAt);
        matchDto.setStatus(status);
        matchDto.setUrl(url);

        // 그룹 채팅 생성  -> 채팅 코드 받아오기
        int chatCode = matchService.createNewGroupChat(userId, matchDto.getTitle());
        matchDto.setChatCode(chatCode);

        // 호스트 채팅방 참여
        matchService.addHostGroupChat(chatCode,userId);

        // 매칭 등록 -> 매치 아이디
        boolean isOk = matchService.addNewMatch(matchDto);

        // 태그 등록

        //matchService.addMatchTag(matchDto.getMatchId(),tag);

        log.info("a : " + matchDto);

        return ResponseEntity.ok().body(null);
    }

}
