package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.NotificationDTO;
import com.club.match.Mapper.NotificationMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class NotificationService {

    @Autowired
    NotificationMapper notificationMapper;

    @Transactional(rollbackFor = Exception.class)
    public boolean sendNotification(NotificationDTO notificationDTO) {
        return notificationMapper.insert(notificationDTO) > 0;
    }

    @Transactional(rollbackFor = Exception.class)
    public Map<String,Object> selectAll(String userId) {

        Map<String,Object> resp = new HashMap<>();

        int count = 0;

        List<NotificationDTO> notificationList = notificationMapper.selectAll(userId);

        for (NotificationDTO notificationDTO : notificationList) {
            switch (notificationDTO.getNotificationCode()){
                case 1:
                    notificationDTO.setType("매칭");
                    break;
                case 2:
                    notificationDTO.setType("친구");
                    break;
                case 3:
                    notificationDTO.setType("커뮤니티");
                    break;
                case 4:
                    notificationDTO.setType("공지사항");
                    break;
            }
            Duration duration = Duration.between(notificationDTO.getReceivedAt(), LocalDateTime.now());

            long minutesAgo = duration.toMinutes();

            if (minutesAgo < 1) {
                long secondsAgo = duration.toSeconds();
                notificationDTO.setTime(secondsAgo+1 + "초 전");
            } else if (minutesAgo < 60) {
                notificationDTO.setTime(minutesAgo + "분 전");
            } else if (minutesAgo < 1440) { // 60분 * 24시간
                long hoursAgo = duration.toHours();
                notificationDTO.setTime(hoursAgo + "시간 전");
            } else {
                long daysAgo = duration.toDays();
                notificationDTO.setTime(daysAgo + "일 전");
            }

            if(notificationDTO.getReadAt() == null){
                count++;
            }

        }

        resp.put("notificationDTOList",notificationList);
        resp.put("noRead", count);

        return resp;
    }

    public boolean read(String userId) {
        return notificationMapper.readAll(userId, LocalDateTime.now()) > 0;
    }

    public boolean delete(String userId, String notificationId) {
        return notificationMapper.delete(userId,notificationId) > 0;
    }
}
