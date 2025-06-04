package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.AttachmentFileDTO;
import com.club.match.Domain.DTO.TempFileDTO;
import com.club.match.Mapper.FileMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.Console;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class FileService {
    // 최종 저장 디렉토리
    private final String BASE_UPLOAD_ROOT_DIR = "src/main/resources/Users/";

    @Autowired
    FileMapper fileMapper;

    // 임시 파일 디렉토리
    @Value("${server.url}")
    private String BASE_URL; //localhost:8100

    // 글쓰기 시 임시 업로드용
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> uploadFile(MultipartFile file, String userId) {
        Map<String, Object> resp = new HashMap<>();

        // 임시 파일 경로
        Path tempUploadPath = Paths.get(BASE_UPLOAD_ROOT_DIR, userId, "community", "temp");

        try {
            // 고유한 파일 이름 생성 (중복 방지)
            String originalFileName = file.getOriginalFilename();
            String fileExtension = Objects.requireNonNull(originalFileName).substring(originalFileName.lastIndexOf("."));
            String dateTimeString = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
            String savedFileName = UUID.randomUUID().toString().substring(0, 8) + "_" + dateTimeString + fileExtension;
            String contentType = file.getContentType();

            Path filePath = tempUploadPath.resolve(savedFileName);

            // temp에 파일 저장
            Files.copy(file.getInputStream(), filePath);
            log.info("커뮤니티 파일 저장 성공 : {}", filePath.toAbsolutePath()); // 절대 경로 로깅

            // 데이터베이스에 링크 저장 (attachmentUrl)
            String fileUrl = BASE_URL + "/" + userId + "/community/" + savedFileName;
            AttachmentFileDTO attachmentFileDTO = new AttachmentFileDTO();
            attachmentFileDTO.setAttachmentUrl(fileUrl);
            attachmentFileDTO.setOriginalFileName(originalFileName);
            attachmentFileDTO.setContentType(contentType); // 콘텐츠 타입이랑 fileExtension 둘 중 뭘 넣어야하지?
            int tempFileInfo = fileMapper.uploadFile(attachmentFileDTO);

            if (tempFileInfo > 0) {
                resp.put("success", true);
                resp.put("message", "파일 정보가 성공적으로 저장되었습니다.");
                resp.put("fileName", attachmentFileDTO.getOriginalFileName());
                resp.put("fileUrl", attachmentFileDTO.getAttachmentUrl());
            } else {
                Files.deleteIfExists(filePath); // DB 저장 실패 시 파일 시스템에 저장된 파일 롤백
                resp.put("success", false);
                resp.put("message", "파일 정보 저장에 실패했습니다.");
                resp.put("fileName", attachmentFileDTO.getOriginalFileName());
            }
        } catch (IOException e) {
            log.error("파일 업로드 실패 (userId: {}, message: {})", userId, e.getMessage());
            resp.put("success", false);
            resp.put("message", "파일 업로드 중 오류가 발생했습니다: " + e.getMessage());
        } catch (Exception e) {
            log.error("파일 정보 저장 중 오류 발생: {}", e.getMessage(), e);
            resp.put("success", false);
            resp.put("message", "파일 정보 저장 중 오류가 발생했습니다: " + e.getMessage());
        }
        return resp;
    }

    // 게시글 저장 시 임시 파일들을 실제 게시글로 이동
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> confirmAndMoveFiles(String userId, String editorContent) {
        Map<String, Object> resp = new HashMap<>();

        try {
            // 1. 임시 postId로 DB에 저장된 모든 파일 목록을 조회
            List<AttachmentFileDTO> tempFiles = fileMapper.selectTempFile(userId);
            if (tempFiles.isEmpty()) {
                // 임시 디렉토리가 아예 비어있었다면 삭제 시도
                Path tempPostIdDir = Paths.get(BASE_UPLOAD_ROOT_DIR, userId, "community", "temp");
                deleteDirectoryIfEmpty(tempPostIdDir);
                resp.put("success", true);
                resp.put("message", "이동할 임시 파일이 없습니다.");
                return resp;
            }

            // 파일명만 남게 됨
            List<String> usedFileNames = matcher.results()
                    .map(match -> match.group(1))
                    .toList();

            // 2. 각 임시 파일을 실제 게시글 디렉토리로 이동하고 DB 업데이트
            for (AttachmentFileDTO tempFile : tempFiles) {
                String fileName = tempFile.getAttachmentUrl().substring(tempFile.getAttachmentUrl().lastIndexOf("/") + 1);

                if (usedFileNames.contains(fileName)) {
                    // 에디터 내용에 포함된 파일만 이동
                    Path sourcePath = Paths.get(BASE_UPLOAD_ROOT_DIR, userId, "community", "temp", fileName);
                    Path targetDirectory = Paths.get(BASE_UPLOAD_ROOT_DIR, userId, "community", "temp");
                    Path targetPath = targetDirectory.resolve(fileName);

                    Files.createDirectories(targetDirectory); // 대상 디렉토리 생성
                    Files.move(sourcePath, targetPath); // 파일 이동

                    // DB의 postId와 attachmentUrl 업데이트
                    String newAttachmentUrl = BASE_URL + "/" + userId + "/community/" + actualPostId + "/" + fileName;
                    tempFile.setPostId(actualPostId);
                    tempFile.setAttachmentUrl(newAttachmentUrl);
                    fileMapper.updatePostIdAndUrl(tempFile);
                    log.info("파일 이동 및 DB 업데이트 완료: {} -> {}", sourcePath, targetPath);
                } else {
                    // 에디터 내용에 포함되지 않은 파일은 삭제
                    Path filePathToDelete = Paths.get(BASE_UPLOAD_ROOT_DIR, userId, "community", String.valueOf(tempPostId), fileName);
                    Files.deleteIfExists(filePathToDelete);
                    fileMapper.deleteFile(tempFile.getPostAttachmentId()); // DB에서도 삭제
                    log.info("사용되지 않는 임시 파일 삭제 완료: {}", filePathToDelete);
                }
            }
            // 모든 파일 처리 후 임시 디렉토리 삭제 시도 (비어있는 경우, 하위 디렉토리까지)
            Path tempPostIdDir = Paths.get(BASE_UPLOAD_ROOT_DIR, userId, "community", String.valueOf(tempPostId));
            deleteDirectoryIfEmpty(tempPostIdDir);

            resp.put("success", true);
            resp.put("message", "임시 파일이 실제 게시글로 성공적으로 이동 및 정리되었습니다.");

        } catch (IOException e) {
            log.error("파일 이동 중 오류 발생 (userId: {}, actualPostId: {}, tempPostId: {}): {}", userId, actualPostId, tempPostId, e.getMessage(), e);
            resp.put("success", false);
            resp.put("message", "파일 이동 중 오류가 발생했습니다: " + e.getMessage());
        } catch (Exception e) {
            log.error("임시 파일 처리 중 예상치 못한 오류 발생 (userId: {}, actualPostId: {}, tempPostId: {}): {}", userId, actualPostId, tempPostId, e.getMessage(), e);
            resp.put("success", false);
            resp.put("message", "임시 파일 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
        return resp;
    }

    // 파일 삭제 메서드
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteAttachmentFile(Long postAttachmentId) {
        try {
            // DB에서 파일 정보 조회
            AttachmentFileDTO fileToDelete = fileMapper.selectAt(postAttachmentId);
            if (fileToDelete == null) {
                log.warn("삭제할 파일 정보를 찾을 수 없습니다: postAttachmentId={}", postAttachmentId);
                return false; // 파일 정보가 없으면 삭제할 필요 없음
            }

            // 파일 시스템에서 파일 삭제 (경로 파싱하여 삭제)
            String fileUrl = fileToDelete.getAttachmentUrl();
            try {
                // URL에서 경로 파싱: BASE_URL/{userId}/community/{id}/{filename} (여기서 id는 tempPostId 또는 actualPostId)
                Pattern urlPattern = Pattern.compile(Pattern.quote(BASE_URL) + "/([^/]+)/community/([^/]+)/([^/]+)");
                Matcher matcher = urlPattern.matcher(fileUrl);

                if (matcher.find()) {
                    String userIdFromFile = matcher.group(1);
                    String id = matcher.group(2); // postId 또는 tempPostId
                    String fileName = matcher.group(3);

                    Path filePath = Paths.get(BASE_UPLOAD_ROOT_DIR, userIdFromFile, "community", id, fileName);

                    Files.deleteIfExists(filePath); // 파일이 존재하면 삭제
                    log.info("파일 시스템에서 파일 삭제 완료: {}", filePath);

                    // 파일 삭제 후 해당 디렉토리가 비어있으면 삭제 시도 (temp/actualPostId 디렉토리까지)
                    Path parentDir = filePath.getParent();
                    if (parentDir != null && Files.exists(parentDir) && Files.isDirectory(parentDir)) {
                        deleteDirectoryIfEmpty(parentDir); // 해당 postId 디렉토리 삭제 시도
                    }

                } else {
                    log.warn("삭제할 파일의 URL 경로를 파싱할 수 없습니다. DB에서만 삭제 시도: {}", fileUrl);
                }
            } catch (IOException e) {
                log.error("파일 시스템에서 파일 삭제 중 오류 발생: {}", e.getMessage(), e);
                // 파일 시스템 삭제 실패해도 DB 삭제는 진행
            }

            // DB에서 파일 정보 삭제
            int rowsAffected = fileMapper.deleteFile(postAttachmentId);
            return rowsAffected > 0;
        } catch (Exception e) {
            log.error("파일 정보 삭제 중 오류 발생: {}", e.getMessage(), e);
            return false;
        }
    }

    // postId로 첨부 파일 목록 조회
    @Transactional(readOnly = true)
    public List<AttachmentFileDTO> getAttachmentFilesByPostId(Long postId) {
        return fileMapper.selectFilesByPostId(postId); // 기존 매퍼 메소드 재활용
    }

    @Transactional(readOnly = true)
    public AttachmentFileDTO getAttachmentFileById(Long postAttachmentId) {
        return fileMapper.selectAt(postAttachmentId);
    }

    @Transactional(rollbackFor = Exception.class)
    public String getOriginalFileName(String fileName) {
        fileName = "%" + fileName + "%";
        return fileMapper.chatFileDownload(fileName);
    }

    // 헬퍼 메소드: 디렉토리가 비어있으면 삭제
    private void deleteDirectoryIfEmpty(Path directory) {
        try {
            if (Files.exists(directory) && Files.isDirectory(directory)) {
                // 비어있는지 확인
                // Files.list()가 IOException을 던질 수 있으므로 try-catch 블록 내부에서 호출
                try (var stream = Files.list(directory)) {
                    if (stream.findAny().isEmpty()) { // 스트림을 닫기 위해 try-with-resources 사용
                        Files.delete(directory);
                        log.info("비어있는 디렉토리 삭제 완료: {}", directory);
                    }
                }
            }
        } catch (IOException e) {
            log.warn("디렉토리 삭제 중 오류 발생 ({}): {}", directory, e.getMessage());
        }
    }
}