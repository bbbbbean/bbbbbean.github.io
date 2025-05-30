package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.AttachmentFileDTO;
import com.club.match.Mapper.FileMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@Slf4j
public class FileService {
    @Autowired
    FileMapper fileMapper;

    // 임시 파일 디렉토리
    @Value("${server.url}")
    private String BASE_URL;

    // 최종 저장 디렉토리
    private final String BASE_UPLOAD_DIR = "src/main/resources/Users/";


    @Transactional(rollbackFor = Exception.class)
    public Map<String,Object> uploadFile(MultipartFile file, String userId, Long tempPostId) {
        Map<String, Object> resp = new HashMap<>();
        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        String newFileName = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")) + fileExtension;
        String contentType = file.getContentType();

        // 임시 파일 경로
        Path tempUploadPath = Paths.get(BASE_UPLOAD_DIR, userId,"community","temp", String.valueOf(tempPostId));
        Path filePath = tempUploadPath.resolve(newFileName);

        try {
            // 디렉토리 생성
            Files.createDirectories(tempUploadPath);
            // 파일 저장
            file.transferTo(filePath);

            // DB에 파일 정보 저장
            AttachmentFileDTO attachmentFileDTO = new AttachmentFileDTO();
            attachmentFileDTO.setPostId(tempPostId);
            attachmentFileDTO.setAttachmentUrl(BASE_URL +"/"+ userId + "/community/" + tempPostId + "/" + newFileName);
            attachmentFileDTO.setOriginalFileName(originalFileName);
            attachmentFileDTO.setContentType(contentType);

            int rowsAffected = fileMapper.uploadFile(attachmentFileDTO);
            if (rowsAffected > 0) {
                resp.put("success", true);
                resp.put("message", "파일 정보가 성공적으로 저장되었습니다.");
                resp.put("postAttachmentId", attachmentFileDTO.getPostAttachmentId()); // 생성된 ID 반환
            } else {
                resp.put("success", false);
                resp.put("message", "파일 정보 저장에 실패했습니다.");
            }
        } catch (Exception e) {
            log.error("파일 정보 저장 중 오류 발생: {}", e.getMessage(), e);
            resp.put("success", false);
            resp.put("message", "파일 정보 저장 중 오류가 발생했습니다: " + e.getMessage());
        }
        return resp;
    }

    // 2. 게시글 저장 시 임시 파일들을 실제 게시글로 이동
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> confirmAndMoveFiles(String userId, Long actualPostId, Long tempPostId, String editorContent) {
        Map<String,Object> resp = new HashMap<>();
        try {
            // 1. 임시 postId로 DB에 저장된 모든 파일 목록을 조회
            List<AttachmentFileDTO> tempFiles = fileMapper.selectTempFilesByPostId(tempPostId);
            if (tempFiles.isEmpty()) {
                resp.put("success", true);
                resp.put("message", "이동할 임시 파일이 없습니다.");
                return resp;
            }
        } catch (Exception e) {

        }
    }

    @Transactional(readOnly = true)
    public AttachmentFileDTO getAttachmentFileById(Long postAttachmentId) {
        return fileMapper.selectAt(postAttachmentId);
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean deleteAttachmentFile(Long postAttachmentId) {
        try {
            int rowsAffected = fileMapper.deleteFile(postAttachmentId);
            return rowsAffected > 0;
        } catch (Exception e) {
            log.error("파일 정보 삭제 중 오류 발생: {}", e.getMessage(), e);
            return false;
        }
    }
    @Transactional(rollbackFor = Exception.class)
    public String getOriginalFileName(String fileName) {
        fileName = "%"+fileName+"%";
        return fileMapper.chatFileDownload(fileName);
    }
}