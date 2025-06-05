package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.*;
import com.club.match.Mapper.MatchMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class MatchService {

    @Autowired
    private MatchMapper matchMapper;

    // 그룹 채팅 생성 및 채팅 코드 받아오기
    @Transactional
    public int createNewGroupChat(String hostId, String title) {
        ChattingDto chattingDto = ChattingDto.builder()
                .hostId(hostId)
                .chatTitle(title)
                .type(1)
                .build();
        matchMapper.insertChatting(chattingDto);
        log.info("d" + chattingDto.getChatCode());
        int chatCode = (int) chattingDto.getChatCode();
        return chatCode;
    }

    // 호스트 채팅방 참여
    @Transactional
    public void addHostGroupChat(int chatCode, String hostId) {
        ChatParticipantDto chatParticipantDto = ChatParticipantDto.builder()
                .chatCode(String.valueOf((long) chatCode))
                .userId(hostId)
                .createAt(LocalDateTime.now())
                .build();
        matchMapper.insertChatparticipant(chatParticipantDto);
    }

    // 매칭 등록
    @Transactional
    public boolean addNewMatch(MatchDto matchDto) {
        boolean isOk = matchMapper.insertMatch(matchDto) > 0;
        return isOk;
    }

    // 태그 등록
    @Transactional
    public void addMatchTag(long matchId, List<String> tags) {
        MatchTagDto matchTagDto = MatchTagDto.builder()
                .matchId(matchId)
                .tags(tags)
                .build();
        matchMapper.insertTag(matchTagDto);
        log.info("tag : " + matchTagDto);
    }

    // 호스트 생성 매치 참여
    @Transactional
    public void joinMatch(long matchId, String hostId) {
        MatchParticipantDto matchParticipantDto = MatchParticipantDto.builder()
                .matchId(matchId)
                .participantId(hostId)
                .build();
        matchMapper.joinMatch(matchParticipantDto);
    }

    @Transactional
    public List<MatchListDto> MatchAllList() {
        // 태그마다 한줄씩 생성 - 여기 태그는 string tag에 저장
        List<MatchDto> list = matchMapper.matchAllList();
        Set<Long> matchId = new HashSet<>();

        for (MatchDto item : list) {
            matchId.add(item.getMatchId());
        }
        List<MatchListDto> listAll = new ArrayList<>();
        for (Long el : matchId) {
            MatchListDto matchList = new MatchListDto();
            List<String> tags = new ArrayList<>();
            for (MatchDto item : list) {
                if(el == item.getMatchId()) {
                    matchList.setMatchId(item.getMatchId());
                    matchList.setTitle(item.getTitle());
                    matchList.setStatus(item.getStatus());
                    matchList.setStartTime(item.getStartTime());
                    tags.add(item.getTag());
                }
                matchList.setTags(tags);
            }
            listAll.add(matchList);
        }

        return listAll;

}

}
