package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.MatchDto;
import com.club.match.Domain.DTO.TagDTO;
import com.club.match.Mapper.MainMapper;
import com.club.match.Mapper.MatchMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
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

    public List<MatchDto> searchMatchesByKeyword(String keyword) {
        List<MatchDto> matchSearchList = mainMapper.getMatchSearchByKeyword(keyword);

        // matchId별로 MatchDto를 하나로 묶고, 태그 리스트를 만든다
        Map<Long, MatchDto> map = new LinkedHashMap<>();

        for (MatchDto matchDto : matchSearchList) {
            long id = matchDto.getMatchId();

            if (!map.containsKey(id)) {
                map.put(id, MatchDto.builder()
                        .matchId(id)
                        .status(matchDto.getStatus())
                        .startTime(matchDto.getStartTime())
                        .title(matchDto.getTitle())
                        .tags(new ArrayList<>())  // 빈 리스트 초기화
                        .build());
            }
            // tag가 null이 아니면 리스트에 추가
            if (matchDto.getTag() != null) {
                map.get(id).getTags().add(matchDto.getTag());
            }
        }

        return new ArrayList<>(map.values());
    }

}
