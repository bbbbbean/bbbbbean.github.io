package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.MatchDto;
import com.club.match.Domain.DTO.TagDTO;
import com.club.match.Mapper.MainMapper;
import com.club.match.Mapper.MatchMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class MainService {

    @Autowired
    MainMapper mainMapper;

    @Autowired
    MatchMapper matchMapper;

    public List<TagDTO> getTopTags(int limit) {
        return mainMapper.getTopTags(limit);
    }

    public List<MatchDto> getMatchList() {
        List<MatchDto> dbMatchList = mainMapper.getAllMatches();
        List<MatchDto> matchDtoList = new ArrayList<>();
        for(MatchDto matchDto : dbMatchList) {
            matchDtoList.add(MatchDto.builder()
                            .matchId(matchDto.getMatchId())
                            .title(matchDto.getTitle())
                            .location(matchDto.getLocation())
                            .people(matchDto.getPeople())
                            .kategorie(matchDto.getKategorie())
                            .startTime(matchDto.getStartTime())
                    .build());
        }
        return matchDtoList;
    }

    public List<MatchDto> getRandomMatchList() {
        List<MatchDto> randomMatchList = mainMapper.getRandomMatch();

        Collections.shuffle(randomMatchList);

        return randomMatchList.stream()
                .limit(3)
                .map(matchDto -> MatchDto.builder()
                        .matchId(matchDto.getMatchId())
                        .kategorie(matchDto.getKategorie())
                        .title(matchDto.getTitle())
                        .people(matchDto.getPeople())
                        .location(matchDto.getLocation())
                        .startTime(matchDto.getStartTime())
                        .build())
                .collect(Collectors.toList());

    }

//    public List<MatchDto> searchMatchesByKeyword(String keyword) {
//        return matchMapper.findMatchesByKeyword(keyword);
//    }
}
