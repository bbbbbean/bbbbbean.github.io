package com.club.match.Mapper;

import com.club.match.Domain.DTO.ChatParticipantDto;
import com.club.match.Domain.DTO.ChattingDto;
import com.club.match.Domain.DTO.MatchDto;
import com.club.match.Domain.DTO.MatchTagDto;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MatchMapper {

    int insertMatch(MatchDto matchDto);
    int insertChatting(ChattingDto chattingDto);
    int insertChatparticipant(ChatParticipantDto chatParticipantDto);
    int insertTag(MatchTagDto matchTagDto);
}
