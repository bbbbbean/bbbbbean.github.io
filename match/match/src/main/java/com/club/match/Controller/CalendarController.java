package com.club.match.Controller;

import com.club.match.Domain.DTO.CalendarMemoDTO;
import com.club.match.Domain.Service.CalendarService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/api/calendar")
public class CalendarController {

    @Autowired
    CalendarService calendarService;

    @PostMapping("/addMemo")
    public ResponseEntity<?> addMemo(@RequestBody @Validated CalendarMemoDTO calendarMemoDTO) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        calendarMemoDTO.setUserId(authentication.getName());
        boolean isOk = calendarService.addMemo(calendarMemoDTO);
        if(!isOk){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        return ResponseEntity.ok().body(null);
    }
    @PostMapping("/deleteMemo")
    public ResponseEntity<?> deleteMemo(@RequestBody @Validated CalendarMemoDTO calendarMemoDTO) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        calendarMemoDTO.setUserId(authentication.getName());
        boolean isOk = calendarService.removeMemo(calendarMemoDTO);
        if(!isOk){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        return ResponseEntity.ok().body(null);
    }

    @PostMapping("/getMemo")
    public ResponseEntity<?> getMemo(@RequestBody Map<String,Object> req) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userId = authentication.getName();
        Integer year = (Integer)req.get("year");
        Integer month = (Integer)req.get("month");
        String calendarId = (String)req.get("calendarId");
        Map<String,Object> resp = null;
        if(calendarId != null){
            log.info("calendarId : " + calendarId);

            resp = calendarService.getOneMemo(calendarId);

            return ResponseEntity.ok().body(resp);
        } else {

            log.info(userId + "/" + year + "/" + month);

            resp = calendarService.getCalendar(userId,year,month);

            return ResponseEntity.ok().body(resp);
        }
    }
    @PostMapping("/editMemo")
    public ResponseEntity<?> editMemo(@RequestBody @Validated CalendarMemoDTO calendarMemoDTO) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        calendarMemoDTO.setUserId(authentication.getName());
        if(calendarMemoDTO.getContent() == null) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST);
        }

        boolean isOk = calendarService.editMemo(calendarMemoDTO);

        if(!isOk) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok().body(null);
    }
}
