package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.AttachmentFileDTO;
import com.club.match.Domain.DTO.PostDTO;
import com.club.match.Mapper.FileMapper;
import com.club.match.Mapper.PostMapper;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;


@Service
@Slf4j
public class PostService {

    // 최종 저장 디렉토리
    private final String BASE_UPLOAD_ROOT_DIR = "src/main/resources/Users/";

    @Autowired
    private PostMapper postMapper;

    @Autowired
    private FileMapper fileMapper;

    @Autowired
    private FileService fileService;

    // 임시 파일 디렉토리
    @Value("${server.url}")
    private String BASE_URL; //localhost:8100

    // 게시글 저장 메서드
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> savePost(PostDTO postDTO) {
        Map<String, Object> resp = new HashMap<>();
        String userId = postDTO.getUserId();

        try {
            // 게시글 DB에 저장
            int rowsAffected = postMapper.insertPost(postDTO);
            if (rowsAffected <= 0) {
                resp.put("success", false);
                resp.put("message", "게시글 저장에 실패했습니다.");
                // DB 저장 실패 시 바로 롤백 및 종료
                throw new RuntimeException("게시글 DB 저장 실패");
            }
            log.info("게시글 저장 성공. Post ID를 가져옵니다.");

            // postId 가져오기
            Long postId = postMapper.getPostId(postDTO);
            if (postId == null) {
                resp.put("success", false);
                resp.put("message", "저장된 게시글의 ID를 가져올 수 없습니다.");
                throw new RuntimeException("postId 획득 실패");
            }
            log.info("postId 가져오기 성공! {}", postId);

            postDTO.setPostId(postId);

            // HTML 문자열로부터 Document 객체 파싱
            Document doc = Jsoup.parse(postDTO.getContent());

            // 모든 <img> 태그 선택
            Elements images = doc.select("img");
            List<String> srcList = new ArrayList<>(); // 문자열에 담겨져있는 img태그 목록들

            // 각 <img> 태그에서 속성 추출
            for (Element image : images) {
                String src = image.attr("src");
                System.out.println("src: " + src);
                fileMapper.updatePostAttachment(postId, src); // 글 본문에 존재하면 postId를 입력
                srcList.add(src);
            }

            // postId 없으면 url 삭제
            fileMapper.deleteTempFileList(userId);

            // temp 폴더의 파일을 실제 {postID} 폴더로 옮기기. 실패하면 롤백
            Map<String, Object> fileMoveResult = fileService.confirmAndMoveFiles(userId, postId, srcList);
            if (!(boolean) fileMoveResult.get("status").equals("success")) { // FileService의 응답 키는 "status"임
                // 파일 이동/정리 실패 시 게시글 저장도 롤백되도록 예외 발생
                log.error("게시글 파일 처리 중 오류 발생: {}", fileMoveResult.get("message"));
                resp.put("success", false);
                resp.put("message", "게시글은 저장되었으나 파일 처리 중 문제가 발생했습니다: " + fileMoveResult.get("message"));
                throw new RuntimeException("파일 처리 실패: " + fileMoveResult.get("message")); // 롤백을 위해 예외 발생
            }

            // temp 폴더 삭제
            fileService.deleteTempFolder(userId);

            resp.put("success", true);
            resp.put("message", "게시글과 관련 파일이 성공적으로 저장되었습니다.");
            resp.put("postId", postId);

        } catch (Exception e) {
            log.error("게시글 저장 중 오류 발생 (userId: {}): {}", userId, e.getMessage());
            resp.put("success", false);
            resp.put("message", "게시글 저장 중 오류가 발생했습니다: " + e.getMessage());
            throw e; // 롤백을 위해 예외 다시 던지기
        }
        return resp;
    }

    // 게시글 조회
    @Transactional(readOnly = true)
    public PostDTO getPostById(Long postId) {
        return postMapper.selectPostByPostId(postId);
    }

    // 게시글 삭제
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> deletePost(Long postId) {
        Map<String, Object> resp = new HashMap<>();
        try {
            // 게시글에 연결된 첨부파일 목록 조회
            List<AttachmentFileDTO> filesToDelete = fileService.getAttachmentFilesByPostId(postId);

            // 각 첨부파일 삭제 (파일 시스템 및 DB)
            for (AttachmentFileDTO file : filesToDelete) {
                fileService.deleteAttachmentFile(file.getPostAttachmentId()); // 파일 시스템 및 DB에서 개별 파일 삭제
            }
            log.info("게시글 ID {}에 연결된 모든 파일이 삭제되었습니다.", postId);

            // 게시글 DB에서 삭제
            int rowsAffected = postMapper.deletePost(postId);

            if (rowsAffected > 0) {
                resp.put("success", true);
                resp.put("message", "게시글과 관련 파일이 성공적으로 삭제되었습니다.");
            } else {
                resp.put("success", false);
                resp.put("message", "게시글 삭제에 실패했습니다 (게시글이 존재하지 않거나 권한이 없음).");
            }


        } catch (Exception e) {
            log.error("게시글 삭제 중 오류 발생 (postId: {}): {}", postId, e.getMessage(), e);
            resp.put("success", false);
            resp.put("message", "게시글 삭제 중 오류가 발생했습니다: " + e.getMessage());
            throw e; // 롤백을 위해 예외 다시 던지기
        }
        return resp;
    }
}
