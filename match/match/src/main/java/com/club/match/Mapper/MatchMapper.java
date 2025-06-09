package com.club.match.Mapper;

import com.club.match.Domain.DTO.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MatchMapper {

    int insertMatch(MatchDto matchDto);
    int insertChatting(ChattingDto chattingDto);
    int insertChatparticipant(ChatParticipantDto chatParticipantDto);
    int insertTag(MatchTagDto matchTagDto);
    int joinMatch(MatchParticipantDto matchParticipantDto);
    List<MatchDto> matchAllList();
    int addBookmark(BookmarkDto bookmarkDto);
    int removeBookmark(BookmarkDto bookmarkDto);
    List<Long> userBookmark(String userId);
    List<MatchOneDto> selectMatchOne(long matchId);
    List<MatchDto> matchTypeList(String type);
}
