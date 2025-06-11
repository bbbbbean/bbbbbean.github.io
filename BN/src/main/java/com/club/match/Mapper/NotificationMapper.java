package com.club.match.Mapper;

import com.club.match.Domain.DTO.NotificationDTO;
import org.apache.ibatis.annotations.Mapper;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface NotificationMapper {

    int insert(NotificationDTO notificationDTO);

    List<NotificationDTO> selectAll(String userId);

    int readAll(String userId, LocalDateTime readAt);

    int delete(String userId, String notificationId);
}
