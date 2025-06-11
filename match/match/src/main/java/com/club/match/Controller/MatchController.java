package com.club.match.Controller;

import com.club.match.Domain.DTO.*;
import com.club.match.Domain.Service.MatchService;
import com.club.match.Domain.Service.NotificationService;
import com.club.match.Domain.Service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
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

    @Autowired
    private UserService userService;

    @Autowired
    SimpMessagingTemplate template;

    @Autowired
    NotificationService notificationService;

    @PostMapping("/list/newMatch")
    public ResponseEntity<?> matchNew(@RequestBody @Validated MatchDto matchDto){
        Map<Object,String> warnning = new HashMap<>();
        if(matchDto.getTitle()==null||matchDto.getStartTime()==null||matchDto.getTags().isEmpty()){
            warnning.put("warnning","필수 입력 값이 누락되었습니다.");
            return ResponseEntity.badRequest().body(warnning);
        }

        if(matchDto.getStartTime().isBefore(LocalDateTime.now())){
            warnning.put("warnning","선택할 수 없는 날짜입니다.");
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
    public ResponseEntity<?> matchAllList(@RequestParam Map<String,Object> req){
        String type = (String)req.get("type");
        log.info("type"+type);
        List<MatchListDto> resp = matchService.MatchAllList(type);
        log.info("resp"+resp);
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

    // 단건 매치 detail
    @PostMapping("/detail")
    public ResponseEntity<?> selectOneMatch(@RequestBody Map<String,Object> req){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        Long matchId = ((Integer)req.get("matchId")).longValue();
        MatchOneDto oneMatch = matchService.selectOneMatch(matchId);
        oneMatch.setStartTime(oneMatch.getStartTime());
        oneMatch.setMatchId(matchId);
        List<String> tags = matchService.getTags(matchId);
        oneMatch.setTags(tags);
        log.info("oneMatch"+oneMatch);
        if(oneMatch.getUserId().equals(userId)){ // 호스트인지
            oneMatch.setHosted(1);
        } else {
            int isOk = matchService.selectJoinMatch(matchId,userId);
            if (isOk > 0){
                oneMatch.setHosted(2); // 참여자인지
            } else {
                oneMatch.setHosted(3);
            }
            log.info("isOk"+isOk);
        }

        // 비교값 호스트(1), 참가자(2) = 로그인한 유저
        // 참가자 아이디 set1 / && 호스트 아이디 set0

        return ResponseEntity.ok().body(oneMatch);
    }

    // 매치 참가
    @PostMapping("/join")
    public ResponseEntity<?> joinOneMatch(@RequestBody Map<String,Object> req){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String)authentication.getName();
        Long matchId = ((Integer)req.get("matchId")).longValue();
        int chatCode = (Integer)req.get("chatCode");

        MatchOneDto matchOneDto = matchService.selectOneMatch(matchId);
        UserDTO userDTO = userService.serchUserOne(userId);

        log.info("thiiiiis"+userId+matchId+chatCode);
        // 조건 검사 : condi 값들, 유저의 gender, 공개여부
        // 실명
        log.info("usususus : " + userDTO.isPrivate());
        log.info("usususus : " + matchOneDto.getGender());
        log.info("usususus : " + userDTO.getGender());
        if(matchOneDto.getAnonymousCondi() == 1 && !userDTO.isPrivate()){
            log.info("nononononononononono");
            return ResponseEntity.badRequest().body(null);
        }
        // 성별
        if(matchOneDto.getGenderCondi() == 0 && !matchOneDto.getGender().equals(userDTO.getGender())){
            log.info("nonononononononononononono");
            return ResponseEntity.badRequest().body(null);
        }

        // 매치 참여자 테이블 삽입
        matchService.joinMatch(matchId,userId);
        // 채팅 테이블 삽입
        matchService.addHostGroupChat(chatCode,userId);

        // 사람수 비교 후 status 상태 업데이트
        if(matchOneDto.getCountPeople()+1 == matchOneDto.getPeople()){
            matchService.updateStatus(1, matchId);
        }

        return ResponseEntity.ok().body(null);
    }

    // 매칭 삭제
    @PostMapping("/delete")
    public ResponseEntity<?> deleteMatch(@RequestBody Map<String,Object> req){

        Long matchId = ((Integer)req.get("matchId")).longValue();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userId = (String)authentication.getName();

        MatchOneDto matchOneDto = matchService.selectOneMatch(matchId);

        Duration duration = Duration.between(LocalDateTime.now(), matchOneDto.getStartTime());

        long days = duration.toDays();
        log.info("days"+days);

        if(days == 1){
            return ResponseEntity.badRequest().body("매치 하루전에는 삭제할수 없습니다.");
        }

        if(matchOneDto.getUserId().equals(userId)) {
            matchService.deleteMatch(matchId);

            int chatCode = matchOneDto.getChatCode();

            // 그룹 채팅 삭제
            matchService.deleteGroupChat(chatCode);
        }

        List<String> list = matchService.allUser(matchId);

        log.info("매칭 참여자 : " + list);

        Map<String,Object> resp = new HashMap<>();

        resp.put("matchAlert","ok");

        for(String sendUserId : list){
            NotificationDTO notificationDTO = NotificationDTO.builder()
                    .userId(sendUserId)
                    .receivedAt(LocalDateTime.now())
                    .content("\"<span style='font-weight: bold; color: #7B68EE;'>" + matchOneDto.getTitle() +
                            "</span>\"<br/>" +
                            "매칭이 삭제 되었습니다.")
                    .notificationCode(1)
                    .build();
            notificationService.sendNotification(notificationDTO);
            template.convertAndSend("/sub/user/"+sendUserId, resp);
        }

        return ResponseEntity.ok().body(null);
    }

    // 참여 취소
    @PostMapping("/cancel")
    public ResponseEntity<?> cancelMatch(@RequestBody Map<String,Object> req){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String)authentication.getName();

        Long matchId = ((Integer)req.get("matchId")).longValue();


        MatchOneDto matchOneDto = matchService.selectOneMatch(matchId);

        Duration duration = Duration.between(LocalDateTime.now(), matchOneDto.getStartTime());

        long days = duration.toDays();

        if(days == 1){
            return ResponseEntity.badRequest().body("매치 하루전에는 취소할수 없습니다.");
        }

        // 매칭 참여 테이블에서 삭제
        matchService.cancelMatch(matchId, userId);

        int chatCode = matchOneDto.getChatCode();
        // 채팅방 나오기
        matchService.exitGroupChat(chatCode,userId);
        log.info("people : "+matchOneDto.getCountPeople());

        // 사람수 비교 후 status 상태 업데이트
        if(matchOneDto.getCountPeople()<matchOneDto.getPeople()){
            matchService.updateStatus(0,matchId);
        }

        return ResponseEntity.ok().body(null);
    }
}
