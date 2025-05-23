package com.club.match.Domain.Service;


import com.club.match.Domain.DTO.CalendarMemoDTO;
import com.club.match.Mapper.CalendarMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class CalendarService {
    @Autowired
    CalendarMapper calendarMapper;

    @Transactional(rollbackFor = Exception.class)
    public boolean addMemo(CalendarMemoDTO calendarNoteDTO){
        boolean isOk = calendarMapper.insertMemo(calendarNoteDTO) > 0;
        return isOk;
    }
    @Transactional(rollbackFor = Exception.class)
    public boolean removeMemo(CalendarMemoDTO calendarNoteDTO){
        boolean isOk = calendarMapper.deleteUserMemo(calendarNoteDTO) > 0;
        return isOk;
    }
    @Transactional(rollbackFor = Exception.class)
    public Map<String,Object> getMemo(String userId, int year, int month){
        Map<String,Object> resp = new HashMap<>();
        List<CalendarMemoDTO> calendarNoteDTOs = calendarMapper.selectAllUserMemo(userId,year,month);
        for (CalendarMemoDTO calendarMemoDTO : calendarNoteDTOs){
            calendarMemoDTO.setContent(calendarMemoDTO.getContent().substring(0,4)+"...");
        }
        resp.put("noteData",calendarNoteDTOs);

        return resp;
    }

    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> getOneMemo(String calendarId) {
        Map<String,Object> resp = new HashMap<>();
        CalendarMemoDTO calendarNoteDTO = calendarMapper.selectOneMemo(calendarId);
        resp.put("noteData",calendarNoteDTO);
        return resp;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean editMemo(CalendarMemoDTO calendarMemoDTO) {
        boolean isOk = calendarMapper.updateUserMemo(calendarMemoDTO) > 0;
        return isOk;
    }
}
