package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.AttachmentFileDTO;
import com.club.match.Mapper.FileMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Path;
import java.util.HashMap;
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
    public Map<String,Object> uploadFile(AttachmentFileDTO attachmentFileDTO) {
        Map<String, Object> resp = new HashMap<>();
        try {
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

}