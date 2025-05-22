package com.club.match.Controller;

import com.club.match.Domain.DTO.CalendarMemoDTO;
import com.club.match.Domain.Service.CalendarService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> addMemo(@RequestBody @Validated CalendarMemoDTO calendarNoteDTO) {
        boolean isOk = calendarService.addMemo(calendarNoteDTO);
        if(!isOk){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        return ResponseEntity.ok().body(null);
    }
    @PostMapping("/deleteMemo")
    public ResponseEntity<?> deleteMemo(@RequestBody @Validated CalendarMemoDTO calendarMemoDTO) {

        boolean isOk = calendarService.removeMemo(calendarMemoDTO);
        if(!isOk){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        return ResponseEntity.ok().body(null);
    }

    @PostMapping("/getMemo")
    public ResponseEntity<?> getMemo(@RequestBody Map<String,Object> req) {

        String userId = (String)req.get("userId");
        int year = (int)req.get("year");
        int month = (int)req.get("month");

        log.info(userId + "/" + year + "/" + month);

        Map<String,Object> resp = calendarService.getMemo(userId,year,month);

        return ResponseEntity.ok().body(resp);
    }
}
