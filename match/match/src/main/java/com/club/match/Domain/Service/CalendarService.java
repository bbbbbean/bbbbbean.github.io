package com.club.match.Domain.Service;


import com.club.match.Domain.DTO.CalendarMemoDTO;
import com.club.match.Mapper.CalendarMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CalendarService {
    @Autowired
    CalendarMapper calendarMapper;

    public boolean addMemo(CalendarMemoDTO calendarNoteDTO){
        boolean isOk = calendarMapper.insertMemo(calendarNoteDTO) > 0;
        return isOk;
    }
    public boolean removeMemo(CalendarMemoDTO calendarNoteDTO){
        boolean isOk = calendarMapper.deleteUserMemo(calendarNoteDTO) > 0;
        return isOk;
    }
    public Map<String,Object> getMemo(String userId, int year, int month){
        Map<String,Object> resp = new HashMap<>();
        List<CalendarMemoDTO> calendarNoteDTOs = calendarMapper.selectAllUserMemo(userId,year,month);
        resp.put("noteData",calendarNoteDTOs);

        return resp;
    }
}
