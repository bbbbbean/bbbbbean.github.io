package com.club.match.Controller;

import com.club.match.Domain.DTO.AttachmentFileDTO;
import com.club.match.Mapper.FileMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Controller
@Slf4j
public class FileController {

    @Autowired
    private FileMapper fileMapper;

    private static final List<String> IMAGE_EXTENSION = Arrays.asList("jpg", "jpeg", "png", "gif", "webp");
    private final String BASE_UPLOAD_DIR = "src/main/resources/Users/";

    // 프로파일 이미지 업로드
    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> profile(@PathVariable String userId) throws IOException {

        Path userProFileDir = Paths.get(BASE_UPLOAD_DIR + userId + "/profile");

        if (!Files.exists(userProFileDir) || !Files.isDirectory(userProFileDir)) {
            return ResponseEntity.notFound().build();
        }

        Path userImagePath = null;
        for (String item : IMAGE_EXTENSION) {
            Path ckechPath = userProFileDir.resolve("profile." + item);
            if (Files.exists(ckechPath)) {
                userImagePath = ckechPath;
                break;
            }
        }

        Resource imageResource = new UrlResource(userImagePath.toUri());
        String contentType = Files.probeContentType(userImagePath);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + userImagePath.getFileName() + "\"")
                .body(imageResource);

    }

    // 커뮤니티 페이지 이미지 업로드
    @PostMapping("/upload/image/{userId}")
    public ResponseEntity<?> uploadImage(@PathVariable String userId, @RequestParam("image")MultipartFile file) {

        Path userImgUploadDir = Paths.get(BASE_UPLOAD_DIR + userId + "/images");

        if (file.isEmpty()) {
            return new ResponseEntity<>("업로드할 이미지가 없습니다.", HttpStatus.BAD_REQUEST);
        }

        try {
            // 1. 파일 저장 경로 생성 (없으면 생성)
            if (!Files.exists(userImgUploadDir)) {
                Files.createDirectories(userImgUploadDir);
                log.info("Created upload directory: {}", userImgUploadDir);
            }

            // 2. 고유한 파일 이름 생성 (중복 방지)
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String dateTimeString = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            String savedFileName = UUID.randomUUID().toString().substring(0,8) +"_"+dateTimeString+ fileExtension;
            Path filePath = userImgUploadDir.resolve(savedFileName);

            // 3. 파일 저장
            Files.copy(file.getInputStream(), filePath);
            log.info("Image uploaded successfully: {}", filePath);

            // 4. 데이터베이스에 링크 저장
            String fileUrl = "/static/Users/" + userId + "/uploads/" + savedFileName;

            AttachmentFileDTO attachmentFileDTO = new AttachmentFileDTO();
            attachmentFileDTO.setPostId(1L); //
            attachmentFileDTO.setAttachmentUrl(fileUrl);

            fileMapper.uploadFile(attachmentFileDTO);
            log.info("File attachment info saved to DB via Mybatis: {}", attachmentFileDTO.getAttachmentUrl());

            // 5. 클라이언트에 반환할 파일 URL 생성
            Map<String,String> response = new HashMap<>();
            response.put("fileUrl", fileUrl);
            response.put("fileName", originalFileName);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (IOException e) {
            log.error("Failed to upload file for userId: {}", userId, e);
            return new ResponseEntity<>("파일 업로드 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("An unexpected error occurred during file upload for userId: {}", userId, e);
            return new ResponseEntity<>("파일 업로드 중 알 수 없는 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
