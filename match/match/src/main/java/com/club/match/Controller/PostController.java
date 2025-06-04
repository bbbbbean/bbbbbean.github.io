package com.club.match.Controller;

import com.club.match.Domain.DTO.PostDTO;
import com.club.match.Domain.DTO.TempFileDTO;
import com.club.match.Domain.Service.FileService;
import com.club.match.Domain.Service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@Slf4j
public class PostController {

    private final String BASE_UPLOAD_ROOT_DIR = "src/main/resources/Users/";

    @Autowired
    FileService fileService;

    @Autowired
    PostService postService;

    @Value("${server.url}")
    private String BASE_URL;

    // 커뮤니티 페이지 파일 업로드(temp로)
    @PostMapping("/upload/file")
    public ResponseEntity<?> uploadTempCommunityFile(
            @RequestParam("file") MultipartFile file) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        try {
            // temp에 파일 업로드 및 DB에 링크 입력 메서드 실행
            Map<String, Object> serviceResponse = fileService.uploadFile(file, userId);

            // 클라이언트에 반환할 파일 URL 및 원본 파일명
            Map<String, Object> response = new HashMap<>();
            response.put("fileUrl", serviceResponse.get("fileUrl"));
            response.put("fileName", serviceResponse.get("fileName"));
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            log.error("파일 업로드 중 알 수 없는 오류 발생 userId: {}", userId, e);
            return new ResponseEntity<>("파일 업로드 중 알 수 없는 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 저장 버튼 눌렀을 때 작동
    @PostMapping("/post/save")
    public ResponseEntity<?> saveCommunityPost(@RequestBody PostDTO postDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        if (userId == null) {
            log.warn("인증되지 않은 사용자가 글쓰기 시도. 유효하지 않은 아이디");
            return new ResponseEntity<>("로그인정보가 없습니다.", HttpStatus.UNAUTHORIZED);
        }

        postDTO.setUserId(userId);
        postDTO.setCreateAt(LocalDateTime.now());

        if (postDTO.getPostCodeId() == null) {
            log.warn("Bad request: postCodeId is missing for userId: {}", userId);
            return new ResponseEntity<>("게시판 종류(postCodeId)를 지정해야 합니다.", HttpStatus.BAD_REQUEST);
        }

        // postService를 통해 게시글 저장 및 postId 반환
        log.info("게시글 저장 요청 수신: userId={}, title={}", postDTO.getUserId(), postDTO.getTitle());
        try {
            Map<String, Object> serviceResponse = postService.savePost(postDTO);

            if (serviceResponse.get("success").equals(true)) {
                log.info("게시글이 성공적으로 저장되었습니다. postId: {}", serviceResponse.get("postId"));
                return new ResponseEntity<>(serviceResponse, HttpStatus.OK);
            } else {
                log.error("게시글 저장 실패: {}", serviceResponse.get("message"));
                return new ResponseEntity<>(serviceResponse.get("message"), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            log.error("게시글 저장 중 예외 발생: {}", e.getMessage(), e);
            return new ResponseEntity<>("게시글 저장 중 알 수 없는 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
