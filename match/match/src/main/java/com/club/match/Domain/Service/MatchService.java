package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.ChatParticipantDto;
import com.club.match.Domain.DTO.ChattingDto;
import com.club.match.Domain.DTO.MatchDto;
import com.club.match.Domain.DTO.MatchTagDto;
import com.club.match.Mapper.MatchMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class MatchService {

    @Autowired
    private MatchMapper matchMapper;

    // 그룹 채팅 생성 및 채팅 코드 받아오기
    @Transactional
    public int createNewGroupChat(String hostId, String title){
        ChattingDto chattingDto = ChattingDto.builder()
                .hostId(hostId)
                .chatTitle(title)
                .type(1)
                .build();
        matchMapper.insertChatting(chattingDto);
        log.info("d"+chattingDto.getChatCode());
        int chatCode = (int)chattingDto.getChatCode();
        return chatCode;
    }

    // 호스트 채팅방 참여
    @Transactional
    public void addHostGroupChat(int chatCode,String hostId){
        ChatParticipantDto chatParticipantDto = ChatParticipantDto.builder()
                .chatCode(String.valueOf((long)chatCode))
                .userId(hostId)
                .createAt(LocalDateTime.now())
                .build();
        matchMapper.insertChatparticipant(chatParticipantDto);
    }

    // 매칭 등록
    @Transactional
    public boolean addNewMatch(MatchDto matchDto){
        boolean isOk = matchMapper.insertMatch(matchDto)>0;
        return isOk;
    }

    // 태그 등록
    public void addMatchTag(long matchId, List<String> tags){
        MatchTagDto matchTagDto = MatchTagDto.builder()
                .matchId(matchId)
                .tags(tags)
                .build();
        matchMapper.insertTag(matchTagDto);
        log.info("tag : " + matchTagDto);
    }

}
