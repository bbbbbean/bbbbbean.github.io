package com.club.match.Domain.Service;

import com.club.match.Mapper.ChatMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class ChatService {

    @Autowired
    ChatMapper chatMapper;

    public Map<String, Object> subscribeSearch(String userId) {
        Map<String,Object> resp = new HashMap<>();
        List<String> list = chatMapper.selectAllChat(userId);
        resp.put("subscribeList", list);

        return resp;
    }
}
