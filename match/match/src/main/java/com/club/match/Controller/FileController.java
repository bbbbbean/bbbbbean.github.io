package com.club.match.Controller;

import com.club.match.Domain.DTO.AttachmentFileDTO;
import com.club.match.Domain.Service.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
public class FileController {

    private final String BASE_UPLOAD_DIR = "src/main/resources/Users/";

    @Autowired
    FileService fileService;


    // 커뮤니티 페이지 이미지 업로드
    @PostMapping("/upload/image/{userId}/{postId}")
    public ResponseEntity<?> uploadCommunityImage(
            @PathVariable String userId,
            @PathVariable Long postId,
            @RequestParam("image") MultipartFile file) {

        // 파일 저장 경로
        Path communityImgUploadDir = Paths.get(BASE_UPLOAD_DIR, userId, "community", String.valueOf(postId), "images");

        if (file == null) {
            return new ResponseEntity<>("업로드할 이미지가 없습니다.", HttpStatus.BAD_REQUEST);
        }

        try {
            // 1. 파일 저장 경로 생성 (없으면 생성)
            if (!Files.exists(communityImgUploadDir)) {
                Files.createDirectories(communityImgUploadDir);
                log.info("Created upload directory: {}", communityImgUploadDir);
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
            String fileUrl = "/user_data/" + userId + "/community/images/" + savedFileName;

            AttachmentFileDTO attachmentFileDTO = new AttachmentFileDTO();
            attachmentFileDTO.setPostId(postId);
            attachmentFileDTO.setAttachmentUrl(fileUrl);

            Map<String, Object> serviceResponse = fileService.uploadFile(attachmentFileDTO);

            if (!(boolean) serviceResponse.get("success")) {
                Files.deleteIfExists(filePath); // DB 저장 실패 시 파일 시스템에 저장된 파일 롤백
                log.error("파일저장실패 userId: {}, postId: {}", userId, postId);
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
    @PostMapping("/upload/file/{userId}/{postId}")
    public ResponseEntity<?> uploadCommunityFile(
            @PathVariable String userId,
            @PathVariable Long postId,
            @RequestParam("file") MultipartFile file) {

        Path communityFileUploadDir = Paths.get(BASE_UPLOAD_DIR, userId, "community", String.valueOf(postId), "uploadedfiles");

        if (file.isEmpty()) {
            return new ResponseEntity<>("업로드할 파일이 없습니다.", HttpStatus.BAD_REQUEST);
        }

        try {
            // 1. 파일 저장 경로 생성 (없으면 생성)
            Files.createDirectories(communityFileUploadDir);
            log.info("Created community file upload directory: {}", communityFileUploadDir);

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
            log.info("커뮤니티 파일 저장 : {}", filePath);

            // 4. 데이터베이스에 링크 저장 (attachmentUrl)
            String fileUrl = "/user_data/" + userId + "/community/" + postId + "/uploadedfiles/" + savedFileName;

            AttachmentFileDTO attachmentFileDTO = new AttachmentFileDTO();
            attachmentFileDTO.setPostId(postId);
            attachmentFileDTO.setAttachmentUrl(fileUrl);

            Map<String, Object> serviceResponse = fileService.uploadFile(attachmentFileDTO);

            if (!(boolean) serviceResponse.get("success")) {
                Files.deleteIfExists(filePath); // DB 저장 실패 시 파일 시스템에 저장된 파일 롤백
                log.error("파일저장실패 userId: {},postId: {}", userId, postId);
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

    // 커뮤니티 페이지 업로드된 파일(이미지 포함) 제공 엔드포인트
    @GetMapping("/user_data/{userId}/community/{postId}/{type}/{filename:.+}")
    public ResponseEntity<Resource> serveCommunityUserFile(
            @PathVariable String userId,
            @PathVariable String postId,
            @PathVariable String type,
            @PathVariable String filename) {
        Path filePath = Paths.get(BASE_UPLOAD_DIR, userId, "community", String.valueOf(postId), type, filename);

        try {
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream"; // 알 수 없는 타입인 경우 기본값
                }
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"") // Content-Disposition 헤더 설정
                        .body(resource); // 응답 본문에 파일 데이터 포함
            } else {
                log.warn("File not found or not readable: {}", filePath);
                return ResponseEntity.notFound().build(); // 5. 파일이 없을 경우 404 응답
            }
        } catch (MalformedURLException e) {
            log.error("Invalid file URL for userId: {}, type: {}, filename: {}", userId, type, filename, e);
            return ResponseEntity.badRequest().build(); // 6. URL 형식 오류 시 400 응답
        } catch (IOException e) {
            log.error("Error serving file for userId: {}, type: {}, filename: {}", userId, type, filename, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 7. 파일 읽기/쓰기 오류 시 500 응답
        }
    }
}
