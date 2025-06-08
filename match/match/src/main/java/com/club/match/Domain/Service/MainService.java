package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.TagDTO;
import com.club.match.Mapper.MainMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class MainService {

    @Autowired
    MainMapper mainMapper;


    public List<TagDTO> getTopTags(int limit) {
        return mainMapper.getTopTags(limit);
    }
}
