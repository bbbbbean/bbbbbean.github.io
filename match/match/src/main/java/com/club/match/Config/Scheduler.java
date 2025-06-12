package com.club.match.Config;

import com.club.match.Domain.DTO.MatchOneDto;
import com.club.match.Domain.DTO.NotificationDTO;
import com.club.match.Domain.Service.NotificationService;
import com.club.match.Mapper.AdminMapper;
import com.club.match.Mapper.MatchMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
public class Scheduler {

    @Autowired
    AdminMapper adminMapper;

    @Autowired
    MatchMapper matchMapper;

    @Autowired
    SimpMessagingTemplate template;

    @Autowired
    NotificationService notificationService;

    @Scheduled(cron = "0 */1 * * * *") // 1분 마다 실행
    public void run() {
        int ok = adminMapper.matchCheck(LocalDateTime.now());
        log.info("updateMatchStatus Count : "+ ok);
    }

    @Scheduled(cron = "0 0 */1 * * *")
    public void alarm() {

        LocalDateTime now = LocalDateTime.now();
        // 다음 날 계산
        LocalDateTime nextDay = now.plusDays(1);

        int nextMonth = nextDay.getMonthValue(); // 다음 날의 월
        int nextDayOfMonth = nextDay.getDayOfMonth(); // 다음 날의 일

        List<Long> nextDayMatch = adminMapper.nextDayMatch(nextMonth,nextDayOfMonth);

        for(Long matchId : nextDayMatch){
            MatchOneDto matchOneDto = matchMapper.selectMatchOne(matchId);

            List<String> Users = matchMapper.allUser(matchId);
            Map<String,Object> resp = new HashMap<>();
            resp.put("matchAlert","ok");
            for(String user : Users){
                NotificationDTO notificationDTO;
                if(matchOneDto.getUserId().equals(user)){
                    notificationDTO = NotificationDTO.builder()
                            .userId(user)
                            .receivedAt(LocalDateTime.now())
                            .content("내일 <span style='font-weight: bold; color: #1E90FF;'>" + user +
                                    "</span>님이 생성한<br/>" +
                                    "\"<span style='font-weight: bold; color: #7B68EE;'>" + matchOneDto.getTitle() +
                                    "</span>\"<br/>" +
                                    "매치가 진행됩니다.")
                            .notificationCode(1)
                            .build();
                } else {
                    notificationDTO = NotificationDTO.builder()
                            .userId(user)
                            .receivedAt(LocalDateTime.now())
                            .content("내일 <span style='font-weight: bold; color: #1E90FF;'>" + user +
                                    "</span>님이 신청한<br/>" +
                                    "\"<span style='font-weight: bold; color: #7B68EE;'>" + matchOneDto.getTitle() +
                                    "</span>\"<br/>" +
                                    "매치가 진행됩니다.")
                            .notificationCode(1)
                            .build();
                }


                notificationService.sendNotification(notificationDTO);

                template.convertAndSend("/sub/user/"+user, resp);
            }
        }

    }
}
