package com.club.match.Mapper;

import com.club.match.Domain.DTO.CalendarMemoDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CalendarMapper {
    int insertMemo(CalendarMemoDTO calendarNoteDTO);
    int deleteUserMemo(CalendarMemoDTO calendarMemoDTO);
    CalendarMemoDTO selectOneMemo(String calendarId);
    List<CalendarMemoDTO> selectAllUserMemo(String userId, int year, int month);
    int updateUserMemo(CalendarMemoDTO calendarMemoDTO);
}
