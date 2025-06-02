package com.club.match.Controller;

import com.club.match.Domain.DTO.AttachmentFileDTO;
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

    private final String BASE_UPLOAD_DIR = "src/main/resources/Users/";

    @Autowired
    FileService fileService;

    @Autowired
    PostService postService;

    @Value("${server.url}")
    private String BASE_URL;

    // 저장 버튼 눌렀을 때 작동
    @PostMapping("/post/save")
    public ResponseEntity<?> savePost(@RequestBody PostDTO postDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();


        if (userId == null) {
            log.warn("인증되지 않은 사용자가 글쓰기 시도. 유효하지 않은 아이디");
            return new ResponseEntity<>("로그인정보가 없습니다.",HttpStatus.UNAUTHORIZED);
        }

        postDTO.setUserId(userId);
        postDTO.setCreateAt(LocalDateTime.now());

        if (postDTO.getPostCodeId() == null){
            log.warn("Bad request: postCodeId is missing for userId: {}", userId);
            return new ResponseEntity<>("게시판 종류(postCodeId)를 지정해야 합니다.", HttpStatus.BAD_REQUEST);
        }

        // postService를 통해 게시글 저장 및 postId 반환
        log.info("게시글 저장 요청 수신: userId={}, title={}", postDTO.getUserId(), postDTO.getTitle());
        try {
            Map<String,Object> serviceResponse = postService.savePost(postDTO);

            if (serviceResponse.get("success").equals(true)) {
                log.info("게시글이 성공적으로 저장되었습니다. postId: {}", serviceResponse.get("postId"));
                return new ResponseEntity<>(serviceResponse, HttpStatus.OK);
            } else {
                log.error("게시글 저장 실패: {}", serviceResponse.get("message"));
                return new ResponseEntity<>(serviceResponse.get("message"), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e){
            log.error("게시글 저장 중 예외 발생: {}", e.getMessage(), e);
            return new ResponseEntity<>("게시글 저장 중 알 수 없는 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


//    // 커뮤니티 페이지 이미지 업로드
//    @PostMapping("/upload/image")
//    public ResponseEntity<?> uploadCommunityImage(
//            @RequestParam("image") MultipartFile file) {
//
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String userId = authentication.getName();
//
//        // 파일 저장 경로
//        Path communityImgUploadDir = Paths.get(BASE_UPLOAD_DIR, userId, "community", String.valueOf(postId), "images");
//
//        if (file == null || file.isEmpty()) {
//            return new ResponseEntity<>("업로드할 이미지가 없습니다.", HttpStatus.BAD_REQUEST);
//        }
//
//        try {
//            // 1. 파일 저장 경로 생성 (없으면 생성)
//            if (!Files.exists(communityImgUploadDir)) {
//                Files.createDirectories(communityImgUploadDir);
//                log.info("폴더 생성 : {}", communityImgUploadDir.toAbsolutePath());
//            }
//
//            // 2. 고유한 파일 이름 생성 (중복 방지)
//            String originalFileName = file.getOriginalFilename();
//            String fileExtension = "";
//            if (originalFileName != null && originalFileName.contains(".")) {
//                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
//            }
//            String dateTimeString = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
//            String savedFileName = UUID.randomUUID().toString().substring(0, 8) + "_" + dateTimeString + fileExtension;
//            Path filePath = communityImgUploadDir.resolve(savedFileName);
//
//            // 3. 파일 저장
//            Files.copy(file.getInputStream(), filePath);
//            log.info("이미지 파일 저장 : {}", filePath);
//
//            // 4. 데이터베이스에 링크 저장
//            String fileUrl = BASE_URL + userId + "/community/" + postId + "/images/" + savedFileName;
//
//            AttachmentFileDTO attachmentFileDTO = new AttachmentFileDTO();
//            attachmentFileDTO.setPostId(postId);
//            attachmentFileDTO.setAttachmentUrl(fileUrl);
//
//            Map<String, Object> serviceResponse = fileService.uploadFile(file, userId, postId);
//
//            if (!(boolean) serviceResponse.get("success")) {
//                Files.deleteIfExists(filePath); // DB 저장 실패 시 파일 시스템에 저장된 파일 롤백
//                log.error("DB에 파일 정보 저장 실패: {}, 저장된 파일 삭제: {}", serviceResponse.get("message"), filePath.toAbsolutePath());
//                return new ResponseEntity<>(serviceResponse.get("message"), HttpStatus.INTERNAL_SERVER_ERROR);
//            }
//            log.info("이미지가 DB에 저장됨: {}", attachmentFileDTO.getAttachmentUrl());
//
//            // 5. 클라이언트에 반환할 파일 URL 생성
//            Map<String, Object> response = new HashMap<>();
//            response.put("fileUrl", fileUrl);
//            response.put("fileName", originalFileName);
//            response.put("postAttachmentId", serviceResponse.get("postAttachmentId"));
//            return new ResponseEntity<>(response, HttpStatus.OK);
//
//        } catch (IOException e) {
//            log.error("Failed to upload file for userId: {}", userId, e);
//            return new ResponseEntity<>("이미지 업로드 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        } catch (Exception e) {
//            log.error("An unexpected error occurred during file upload for userId: {}", userId, e);
//            return new ResponseEntity<>("이미지 업로드 중 알 수 없는 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    // 커뮤니티 페이지 파일 업로드
    @PostMapping("/upload/file")
    public ResponseEntity<?> uploadCommunityFile(
            @RequestParam("file") MultipartFile file) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        Path communityFileUploadDir = Paths.get(BASE_UPLOAD_DIR, userId, "community", "temp");

        if (file == null || file.isEmpty()) {
            return new ResponseEntity<>("업로드할 파일이 없습니다.", HttpStatus.BAD_REQUEST);
        }

        try {
            // 1. 파일 저장 경로 생성 (없으면 생성)
            Files.createDirectories(communityFileUploadDir);
            log.info("Created community file upload directory: {}", communityFileUploadDir.toAbsolutePath());

            // 2. 고유한 파일 이름 생성 (중복 방지)
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String dateTimeString = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            String savedFileName = UUID.randomUUID().toString().substring(0, 8) + "_" + dateTimeString + fileExtension;
            Path filePath = communityFileUploadDir.resolve(savedFileName);

            // 3. 파일 저장
            Files.copy(file.getInputStream(), filePath);
            log.info("커뮤니티 파일 저장 성공 : {}", filePath.toAbsolutePath()); // 절대 경로 로깅

            // 4. 데이터베이스에 링크 저장 (attachmentUrl)
            String fileUrl =BASE_URL +"/"+ userId + "/community/" + "temp/" + savedFileName;

            TempFileDTO tempFileDTO = new TempFileDTO();
            tempFileDTO.setAttachmentUrl(fileUrl);

            Map<String, Object> serviceResponse = fileService.uploadFile(file,userId);

            if (!(boolean) serviceResponse.get("success")) {
                Files.deleteIfExists(filePath); // DB 저장 실패 시 파일 시스템에 저장된 파일 롤백
                log.error("DB에 파일 정보 저장 실패 (userId: {} ): {}, 저장된 파일 삭제: {}", userId,  serviceResponse.get("message"), filePath.toAbsolutePath());
                return new ResponseEntity<>(serviceResponse.get("message"), HttpStatus.INTERNAL_SERVER_ERROR);
            }
            log.info("파일이 DB에 저장됨: {}", tempFileDTO.getAttachmentUrl());

            // 5. 클라이언트에 반환할 파일 URL 및 원본 파일명
            Map<String, Object> response = new HashMap<>();
            response.put("fileUrl", fileUrl);
            response.put("fileName", originalFileName);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (IOException e) {
            log.error("파일 업로드 실패 userId: {}", userId);
            return new ResponseEntity<>("파일 업로드 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("파일 업로드 중 알 수 없는 오류 발생 userId: {}", userId, e);
            return new ResponseEntity<>("파일 업로드 중 알 수 없는 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
