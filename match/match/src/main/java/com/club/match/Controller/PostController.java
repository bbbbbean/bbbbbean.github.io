package com.club.match.Controller;

import com.club.match.Domain.DTO.AttachmentFileDTO;
import com.club.match.Domain.Service.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
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

    @Value("${server.url}")
    private String BASE_URL;


    // 커뮤니티 페이지 이미지 업로드
    @PostMapping("/upload/image/{postId}")
    public ResponseEntity<?> uploadCommunityImage(
            @PathVariable Long postId,
            @RequestParam("image") MultipartFile file) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        // 파일 저장 경로
        Path communityImgUploadDir = Paths.get(BASE_UPLOAD_DIR, userId, "community", String.valueOf(postId), "images");

        if (file == null || file.isEmpty()) {
            return new ResponseEntity<>("업로드할 이미지가 없습니다.", HttpStatus.BAD_REQUEST);
        }

        try {
            // 1. 파일 저장 경로 생성 (없으면 생성)
            if (!Files.exists(communityImgUploadDir)) {
                Files.createDirectories(communityImgUploadDir);
                log.info("폴더 생성 : {}", communityImgUploadDir.toAbsolutePath());
            }

            // 2. 고유한 파일 이름 생성 (중복 방지)
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String dateTimeString = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            String savedFileName = UUID.randomUUID().toString().substring(0, 8) + "_" + dateTimeString + fileExtension;
            Path filePath = communityImgUploadDir.resolve(savedFileName);

            // 3. 파일 저장
            Files.copy(file.getInputStream(), filePath);
            log.info("이미지 파일 저장 : {}", filePath);

            // 4. 데이터베이스에 링크 저장
            String fileUrl = BASE_URL + userId + "/community/" + postId + "/images/" + savedFileName;

            AttachmentFileDTO attachmentFileDTO = new AttachmentFileDTO();
            attachmentFileDTO.setPostId(postId);
            attachmentFileDTO.setAttachmentUrl(fileUrl);

            Map<String, Object> serviceResponse = fileService.uploadFile(attachmentFileDTO);

            if (!(boolean) serviceResponse.get("success")) {
                Files.deleteIfExists(filePath); // DB 저장 실패 시 파일 시스템에 저장된 파일 롤백
                log.error("DB에 파일 정보 저장 실패: {}, 저장된 파일 삭제: {}", serviceResponse.get("message"), filePath.toAbsolutePath());
                return new ResponseEntity<>(serviceResponse.get("message"), HttpStatus.INTERNAL_SERVER_ERROR);
            }
            log.info("이미지가 DB에 저장됨: {}", attachmentFileDTO.getAttachmentUrl());

            // 5. 클라이언트에 반환할 파일 URL 생성
            Map<String, Object> response = new HashMap<>();
            response.put("fileUrl", fileUrl);
            response.put("fileName", originalFileName);
            response.put("postAttachmentId", serviceResponse.get("postAttachmentId"));
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (IOException e) {
            log.error("Failed to upload file for userId: {}", userId, e);
            return new ResponseEntity<>("이미지 업로드 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("An unexpected error occurred during file upload for userId: {}", userId, e);
            return new ResponseEntity<>("이미지 업로드 중 알 수 없는 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 커뮤니티 페이지 파일 업로드
    @PostMapping("/upload/file/{postId}")
    public ResponseEntity<?> uploadCommunityFile(
            @PathVariable Long postId,
            @RequestParam("file") MultipartFile file) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String userId = authentication.getName();

        Path communityFileUploadDir = Paths.get(BASE_UPLOAD_DIR, userId, "community", String.valueOf(postId), "uploadedfiles");

        if (file.isEmpty()) {
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
            String fileUrl =BASE_URL+ userId + "/community/" + postId + "/uploadedfiles/" + savedFileName;

            AttachmentFileDTO attachmentFileDTO = new AttachmentFileDTO();
            attachmentFileDTO.setPostId(postId);
            attachmentFileDTO.setAttachmentUrl(fileUrl);

            Map<String, Object> serviceResponse = fileService.uploadFile(attachmentFileDTO);

            if (!(boolean) serviceResponse.get("success")) {
                Files.deleteIfExists(filePath); // DB 저장 실패 시 파일 시스템에 저장된 파일 롤백
                log.error("DB에 파일 정보 저장 실패 (userId: {}, postId: {}): {}, 저장된 파일 삭제: {}", userId, postId, serviceResponse.get("message"), filePath.toAbsolutePath());
                return new ResponseEntity<>(serviceResponse.get("message"), HttpStatus.INTERNAL_SERVER_ERROR);
            }
            log.info("파일이 DB에 저장됨: {}", attachmentFileDTO.getAttachmentUrl());

            // 5. 클라이언트에 반환할 파일 URL 및 원본 파일명
            Map<String, Object> response = new HashMap<>();
            response.put("fileUrl", fileUrl);
            response.put("fileName", originalFileName);
            response.put("postAttachmentId", serviceResponse.get("postAttachmentId")); // 생성된 ID 반환
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (IOException e) {
            log.error("Failed to upload community file for userId: {} and postId: {}", userId, postId, e);
            return new ResponseEntity<>("파일 업로드 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("An unexpected error occurred during community file upload for userId: {} and postId: {}", userId, postId, e);
            return new ResponseEntity<>("파일 업로드 중 알 수 없는 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
