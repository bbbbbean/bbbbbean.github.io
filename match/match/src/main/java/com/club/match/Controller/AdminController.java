package com.club.match.Controller;


import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/books")
    public ResponseEntity<?> test(){
        return ResponseEntity.ok().body(null);
    }


    
//    @GetMapping("/books")
//    public ResponseEntity<Map<String, Object>> getBooks(@Validated PageDTO pageDTO) {
//
//        Map<String, Object> resp = new HashMap<>();
//
//        resp = bookService.adminBook(pageDTO);
//
//        return ResponseEntity.ok().body(resp);
//    }

}
