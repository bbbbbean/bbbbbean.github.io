package com.club.match.Controller;

import com.club.match.Domain.DTO.BookmarkDto;
import com.club.match.Domain.DTO.MatchDto;
import com.club.match.Domain.DTO.MatchListDto;
import com.club.match.Domain.Service.MatchService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
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
    public ResponseEntity<?> matchNew(@RequestBody @Validated MatchDto matchDto){

        Map<Object,String> warnning = new HashMap<>();
        if(matchDto.getTitle()==null||matchDto.getStartTime()==null||matchDto.getTags().isEmpty()){
            warnning.put("warnning","필수 입력 값이 누락되었습니다.");
            return ResponseEntity.badRequest().body(warnning);
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String)authentication.getName();
        LocalDateTime createAt = LocalDateTime.now();
        int status = 0;
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
        List<String> tags = matchDto.getTags();
        matchService.addMatchTag(matchDto.getMatchId(),tags);

        // 호스트 생성된 매칭에 참여
        matchService.joinMatch(matchDto.getMatchId(),userId);

        log.info("a : " + matchDto);

        return ResponseEntity.ok().body(null);
    }

    @GetMapping("/list")
    public ResponseEntity<?> matchAllList(){
        List<MatchListDto> resp = matchService.MatchAllList();
        log.info("resp"+resp);
        log.info("resp"+resp.getFirst().getKategorie());
        return ResponseEntity.ok().body(resp);
    }

    // 북마크
    @PostMapping("/bookmark/add")
    public ResponseEntity<?> bookmarkAdd(@RequestBody BookmarkDto bookmarkDto){
        log.info("bookmarkDto"+bookmarkDto);
        matchService.addBookmark(bookmarkDto);
        return ResponseEntity.ok().body(null);
    }
    @PostMapping("/bookmark/remove")
    public ResponseEntity<?> bookmarkRemove(@RequestBody BookmarkDto bookmarkDto){
        log.info("bookmarkDto"+bookmarkDto);
        matchService.removeBookmark(bookmarkDto);
        return ResponseEntity.ok().body(null);
    }

    @GetMapping("/bookmark/list")
    public ResponseEntity<?> allBookmark(@RequestParam String userId){
        List<Long> bookmarkedMatchIds = matchService.viewUserBookmark(userId);
        return ResponseEntity.ok().body(bookmarkedMatchIds);
    }
}
