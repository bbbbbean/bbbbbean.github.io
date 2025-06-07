package com.club.match.Controller;

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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Controller
@Slf4j
public class ServerFileController {

    @Autowired
    FileService fileService;

    private static final List<String> IMAGE_EXTENSION = Arrays.asList("jpg", "jpeg", "png", "gif", "webp");
    @Value("${file.upload.root-dir}")
    private String BASE_UPLOAD_ROOT_DIR;

    // 프로파일 이미지 업로드
    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> profile(@PathVariable String userId) throws IOException {

        Path userProFileDir = Paths.get(BASE_UPLOAD_ROOT_DIR + userId + "/profile");

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

        Resource imageResource = new UrlResource(Objects.requireNonNull(userImagePath).toUri());
        String contentType = Files.probeContentType(userImagePath);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + userImagePath.getFileName() + "\"")
                .body(imageResource);
    }

    @GetMapping("/chat/{userId}/{fileName}/{fileType}")
    public ResponseEntity<?> chatImage(
            @PathVariable String userId,
            @PathVariable String fileName,
            @PathVariable String fileType) throws IOException {
        //src/main/resources/Users/
        log.info("1");
        Path userProFileDir = Paths.get(BASE_UPLOAD_ROOT_DIR + userId +"/chat/");
        log.info(userProFileDir.toString());
        if (!Files.exists(userProFileDir) || !Files.isDirectory(userProFileDir)) {
            return ResponseEntity.notFound().build();
        }
        log.info("3");

        if(fileType.equals("image") || fileType.equals("video")){
            Path userImagePath = userProFileDir.resolve(fileName);

            Resource imageResource = new UrlResource(userImagePath.toUri());
            String contentType = Files.probeContentType(userImagePath);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + userImagePath.getFileName() + "\"")
                    .body(imageResource);
        } else {
            Path filePath = userProFileDir.resolve(fileName);

            Resource fileResource = new UrlResource(filePath.toUri());
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream"; // 기본값
            }

            log.info("a : " + filePath.getFileName());

            String originalFileName = fileService.getOriginalFileName(fileName);
            String encodedFileName = URLEncoder.encode(originalFileName, StandardCharsets.UTF_8)
                    .replaceAll("\\+", "%20");

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFileName)
                    .body(fileResource);
        }
    }


//    http://localhost:8100/user2/community/ffc67281_20250528120928.png
    // 커뮤니티 페이지 업로드된 파일(이미지 포함) 제공 엔드포인트
    @GetMapping("/{userId}/community/{path:.*}")
    public ResponseEntity<Resource> serveCommunityFile(
            @PathVariable String userId,
            @PathVariable String path) {
        Path filePath;
        // path를 '/'로 분리하여 마지막 부분이 파일명, 그 앞이 폴더명인지 확인
        String[] pathParts = path.split("/");
        String filename = pathParts[pathParts.length - 1]; // 항상 마지막은 파일명

        if (pathParts.length == 1) {
            // 경로에 폴더가 없고 바로 파일명만 있는 경우 (예: user1/community/image.jpg)
            // 이는 temp 폴더에 있을 것으로 간주
            filePath = Paths.get(BASE_UPLOAD_ROOT_DIR, userId, "community", "temp", filename);
            log.info("Serving temporary file: {}", filePath);
        } else if (pathParts.length == 2 && pathParts[0].matches("\\d+")) {
            // 경로에 postId 폴더와 파일명이 있는 경우 (예: user1/community/123/image.jpg)
            String folderName = pathParts[0]; // postId
            filePath = Paths.get(BASE_UPLOAD_ROOT_DIR, userId, "community", folderName, filename);
            log.info("Serving post-specific file: {}", filePath);
        } else {
            // 예상치 못한 경로 형식
            log.warn("Unexpected file path format: {}", path);
            return ResponseEntity.badRequest().build();
        }


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
            log.error("Invalid file URL for userId: {}, type: {}, filename: {}", userId, filename, e.getMessage());
            return ResponseEntity.badRequest().build(); // 6. URL 형식 오류 시 400 응답
        } catch (IOException e) {
            log.error("Error serving file for userId: {}, type: {}, filename: {}", userId, filename, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 7. 파일 읽기/쓰기 오류 시 500 응답
        }
    }

    // 게시글 최종 저장된 파일 서빙 - select 에서 사용
    @GetMapping("/{userId}/community/{postId}/{filename}") // 매핑 경로 추가
    public ResponseEntity<?> serveCommunityAttachedFile(
            @PathVariable String userId,
            @PathVariable Long postId,
            @PathVariable String filename) {

        Path filePath = Paths.get(BASE_UPLOAD_ROOT_DIR, userId, "community", String.valueOf(postId), filename);
        log.info("첨부 파일 조회 요청: {}", filePath);

        try {
            Resource resource = new UrlResource(filePath.toUri()); // postId가 존재하는 url 가져오기

            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream"; // 알 수 없는 타입인 경우 기본값
                }
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + URLEncoder.encode(Objects.requireNonNull(resource.getFilename()), StandardCharsets.UTF_8) + "\"")
                        .body(resource);
            } else {
                log.warn("첨부 파일 찾을 수 없거나 읽을 수 없음: {}", filePath);
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            log.error("첨부 파일 URL 형식 오류: {}", filename, e);
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            log.error("첨부 파일 서빙 중 오류 발생: {}", filename, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
