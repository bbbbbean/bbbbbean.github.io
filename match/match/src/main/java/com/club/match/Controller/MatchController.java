package com.club.match.Controller;

import com.club.match.Domain.DTO.MatchDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/match")
@Slf4j
public class MatchController {

    @PostMapping("/list/newMatch")
    public ResponseEntity<?> matchNew(@RequestBody @Validated MatchDto matchDto){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = (String)authentication.getName();
        LocalDateTime createAt = LocalDateTime.now();
        matchDto.setCreatorId(userId);
        matchDto.setCreateAt(createAt);

        log.info("a : " + matchDto);

        return ResponseEntity.ok().body(null);
    }

}
