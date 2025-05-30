package com.club.match.Controller;

import lombok.extern.slf4j.Slf4j;
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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Controller
@Slf4j
public class ServerFileController {

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
//    http://localhost:8100/user2/community/1/images/ffc67281_20250528120928.png
    // 커뮤니티 페이지 업로드된 파일(이미지 포함) 제공 엔드포인트
    @GetMapping("/{userId}/community/{postId}/{type}/{filename:.+}")
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
