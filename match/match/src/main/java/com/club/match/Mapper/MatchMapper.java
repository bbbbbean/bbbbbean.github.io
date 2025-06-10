package com.club.match.Mapper;

import com.club.match.Domain.DTO.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MatchMapper {

    int insertMatch(MatchDto matchDto);
    long insertChatting(ChattingDto chattingDto);
    int insertChatparticipant(ChatParticipantDto chatParticipantDto);
    int insertTag(MatchTagDto matchTagDto);
    int joinMatch(MatchParticipantDto matchParticipantDto);
    List<MatchDto> matchAllList();
    int addBookmark(BookmarkDto bookmarkDto);
    int removeBookmark(BookmarkDto bookmarkDto);
    List<Long> userBookmark(String userId);
    MatchOneDto selectMatchOne(long matchId);
    List<MatchDto> matchTypeList(String type);
    int updateStatus(int status, long matchId);

    List<String> getTags(Long matchId);
    int selectJoinMatch(Long matchId, String userId);
}
