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
    @Transactional(rollbackFor = Exception.class)
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

    // 호스트, 유저 채팅방 참여
    @Transactional(rollbackFor = Exception.class)
    public void addHostGroupChat(int chatCode, String hostId) {
        ChatParticipantDto chatParticipantDto = ChatParticipantDto.builder()
                .chatCode(String.valueOf((long) chatCode))
                .userId(hostId)
                .createAt(LocalDateTime.now())
                .build();
        matchMapper.insertChatparticipant(chatParticipantDto);
    }

    // 매칭 등록
    @Transactional(rollbackFor = Exception.class)
    public boolean addNewMatch(MatchDto matchDto) {
        boolean isOk = matchMapper.insertMatch(matchDto) > 0;
        return isOk;
    }

    // 태그 등록
    @Transactional(rollbackFor = Exception.class)
    public void addMatchTag(long matchId, List<String> tags) {
        MatchTagDto matchTagDto = MatchTagDto.builder()
                .matchId(matchId)
                .tags(tags)
                .build();
        matchMapper.insertTag(matchTagDto);
        log.info("tag : " + matchTagDto);
    }

    // 생성 매치 참여
    @Transactional(rollbackFor = Exception.class)
    public void joinMatch(long matchId, String userId) {
        MatchParticipantDto matchParticipantDto = MatchParticipantDto.builder()
                .matchId(matchId)
                .participantId(userId)
                .build();
        matchMapper.joinMatch(matchParticipantDto);
    }

    // 태그 모아 출력
    @Transactional(rollbackFor = Exception.class)
    public List<MatchListDto> MatchAllList(String type) {
        // 태그마다 한줄씩 생성 - 여기 태그는 string tag에 저장
        List<MatchDto> list = new ArrayList<>();
        if(type.equals("all")){
            list = matchMapper.matchAllList();
        } else {
            list = matchMapper.matchTypeList(type);
        }
        Set<Long> matchId = new HashSet<>();

        for (MatchDto item : list) {
            matchId.add(item.getMatchId());
        }
        List<MatchListDto> listAll = new ArrayList<>();
        for (Long el : matchId) {
            MatchListDto matchList = new MatchListDto();
            List<String> tags = new ArrayList<>();
            for (MatchDto item : list) {
                if (el == item.getMatchId()) {
                    matchList.setMatchId(item.getMatchId());
                    matchList.setTitle(item.getTitle());
                    matchList.setStatus(item.getStatus());
                    matchList.setStartTime(item.getStartTime());
                    matchList.setPeople(item.getPeople());
                    matchList.setCountPeople(item.getCountPeople());
                    matchList.setKategorie(item.getKategorie());
                    tags.add(item.getTag());
                }
                matchList.setTags(tags);
            }
            listAll.add(matchList);
        }
        return listAll;
    }

    // 북마크 추가
    @Transactional(rollbackFor = Exception.class)
    public void addBookmark(BookmarkDto bookmarkDto){
        matchMapper.addBookmark(bookmarkDto);
    }
    // 북마크 삭제
    @Transactional(rollbackFor = Exception.class)
    public void removeBookmark(BookmarkDto bookmarkDto){
        matchMapper.removeBookmark(bookmarkDto);
    }
    // 해당 유저 북마크 조회
    @Transactional(rollbackFor = Exception.class)
    public List<Long> viewUserBookmark(String userId){
        return matchMapper.userBookmark(userId);
    }

    // 모달용 단일 매치 정보 조회
    @Transactional(rollbackFor = Exception.class)
    public MatchOneDto selectOneMatch(long matchId){
        return matchMapper.selectMatchOne(matchId);
    }

    public List<String> getTags(Long matchId) {
        return matchMapper.getTags(matchId);
    }

    // status 변경
    @Transactional(rollbackFor = Exception.class)
    public void updateStatus(int status, long matchId){
        matchMapper.updateStatus(status, matchId);
    }

    public int selectJoinMatch(Long matchId, String userId) {
        return matchMapper.selectJoinMatch(matchId,userId);
    }

    // 매칭 삭제
    public void deleteMatch(Long matchId){
        matchMapper.deleteMatch(matchId);
    }
    // 매칭 참여 취소
    public void cancelMatch(Long matchId,String userId){
        matchMapper.cancelMatch(matchId,userId);
    }
    // 그룹 채팅방 삭제
    public void deleteGroupChat(int chatCode){
        matchMapper.deleteGroupChat(chatCode);
    }

    // 그룹 채팅방 나가기
    public void exitGroupChat(int chatCode, String userId){
        matchMapper.exitGroupChat(chatCode,userId);
    }
}
