package com.club.match.Config;

import com.club.match.Mapper.AdminMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Slf4j
public class Scheduler {

    @Autowired
    AdminMapper adminMapper;

    @Scheduled(cron = "0 */1 * * * *") // 1분 마다 실행
    public void run() {
        int ok = adminMapper.matchCheck(LocalDateTime.now());
        log.info("updateMatchStatus Count : "+ ok);
    }
}
