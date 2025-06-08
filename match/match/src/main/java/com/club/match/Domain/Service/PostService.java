package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.AttachmentFileDTO;
import com.club.match.Domain.DTO.PostDTO;
import com.club.match.Domain.DTO.PostDetailResultDTO;
import com.club.match.Domain.DTO.PostRecommendationDTO;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;


@Service
@Slf4j
public class PostService {

    // 최종 저장 디렉토리
    @Value("${file.upload.root-dir}")
    private String BASE_UPLOAD_ROOT_DIR;

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
    public Map<String, Object> savePost(PostDTO postDTO, MultipartFile[] files) throws IOException {
        Map<String, Object> resp = new HashMap<>();
        String userId = postDTO.getUserId();

        try {
            // 게시글 DB에 저장
            int rowsAffected = postMapper.insertPost(postDTO);
            Long postId = postDTO.getPostId();

            if (rowsAffected == 0 || postId == null) {
                resp.put("success", false);
                resp.put("message", "저장된 게시글의 ID를 가져올 수 없습니다.");
                throw new RuntimeException("postId 획득 실패");
            }
            log.info("게시글 저장 성공! postId: {}", postId);
            resp.put("success", true);
            resp.put("message", "게시글이 성공적으로 저장되었습니다.");
            resp.put("postId", postId);

            // 에디터 내부 이미지 처리
            List<String> editorImageUrls = new ArrayList<>();
            if (postDTO.getContent() != null && !postDTO.getContent().isEmpty()) {
                Document doc = Jsoup.parse(postDTO.getContent());
                Elements imgTags = doc.select("img[src]");
                for (Element img : imgTags) {
                    String src = img.attr("src");
                    if (src.startsWith(BASE_URL + postDTO.getUserId() + "/community/")) {
                        editorImageUrls.add(src);
                    }
                }
            }

            if (!editorImageUrls.isEmpty()) {
                // 임시 폴더의 파일을 실제 postId 폴더로 이동 및 DB 업데이트
                Map<String, Object> fileMoveResult = fileService.moveImagesTempToPostIdFolder(userId, postId, editorImageUrls);
                Object statusObject = fileMoveResult.get("status");
                boolean isSuccess = false;

                if (statusObject instanceof Boolean) {
                    isSuccess = (Boolean) statusObject;
                } else if (statusObject instanceof String) {
                    isSuccess = "success".equals(statusObject); // "success" 문자열과 비교
                }
                // 다른 타입일 경우, isSuccess는 기본값 false 유지

                if (!isSuccess) { // isSuccess가 false일 경우 (null 포함)
                    log.error("게시글 이미지 파일 처리 중 오류 발생: {}", fileMoveResult.get("message"));
                    resp.put("success", false);
                    resp.put("message", "게시글은 저장되었으나 이미지 파일 처리 중 문제가 발생했습니다: " + fileMoveResult.get("message"));
                    throw new RuntimeException("이미지 파일 처리 실패: " + fileMoveResult.get("message")); // 롤백을 위해 예외 발생
                }
            }

            // 외부 첨부 파일 저장
            if (files != null && files.length > 0) {
                fileService.saveAttachmentFiles(userId, postId, files);
            }

            // temp 파일 및 폴더 삭제
            Map<String, Object> deleteTempResult = fileService.deleteTempFolder(userId);
            String deleteStatus = (String) deleteTempResult.get("status");
            if (deleteStatus == null || !deleteStatus.equals("success")) {
                log.warn("남은 임시 폴더 삭제 중 경고 발생: {}", deleteTempResult.get("message"));
            }
            fileMapper.deleteTempFileList(userId);

        } catch (Exception e) {
            log.error("게시글 저장 중 오류 발생 (userId: {}): {}", userId, e.getMessage(), e);
            resp.put("success", false);
            resp.put("message", "게시글 저장 중 오류가 발생했습니다: " + e.getMessage());
            throw e; // 롤백을 위해 예외 다시 던지기
        }
        return resp;
    }


    // 게시글 조회
    @Transactional
    public PostDTO getPostByPostId(Long postId) {
        // 1. 조회수 증가
        postMapper.incrementViewCount(postId);
        log.info("게시글 ID: {} 조회수 증가", postId);

        // 2. 게시글 상세 정보 조회 (첨부파일도 함께 가져옴)
        PostDetailResultDTO postDetail = postMapper.selectPostByPostId(postId);

        // 3. 첨부 파일 정보 별도로 조회
        List<AttachmentFileDTO> attachments = postMapper.selectAttachmentsByPostId(postId);

        // 4. PostDTO로 결과 통합 및 반환
        if (postDetail == null) {
            log.warn("게시글 ID: {} 를 찾을 수 없습니다.", postId);
            return null;
        } else {
            // PostDetailResultDTO의 필드들을 PostDTO로 복사
            PostDTO post = new PostDTO();
            post.setPostId(postDetail.getPostId());
            post.setUserId(postDetail.getUserId());
            post.setNickName(postDetail.getNickName());
            post.setTitle(postDetail.getTitle());
            post.setContent(postDetail.getContent());
            post.setCreateAt(postDetail.getCreateAt());
            post.setViewCount(postDetail.getViewCount());
            post.setPostCodeId(postDetail.getPostCodeId());
            post.setLikeCount(postDetail.getLikeCount());
            post.setDislikeCount(postDetail.getDislikeCount());
            post.setAttachments(attachments); // 첨부 파일 목록 설정

            log.info("게시글 ID: {} 상세 정보 조회 성공. 제목: {}, 첨부 파일 수: {}",
                    postId, post.getTitle(), post.getAttachments() != null ? post.getAttachments().size() : 0);
            return post;
        }
    }

    // 게시글 좋아요/싫어요 기능
    @Transactional
    public boolean handlePostReaction(Long postId, String userId, Integer requestedType) {
        if (requestedType != 1 && requestedType != -1) {
            log.warn("유효하지 않은 반응 타입: {}. postId: {}, userId: {}", requestedType, postId, userId);
            return false; // 유효하지 않은 요청 타입
        }

        // 1. 해당 사용자가 해당 게시글에 이미 반응한 기록이 있는지 조회
        PostRecommendationDTO existingReaction = postMapper.selectPostRecommendationByUserIdAndPostId(postId, userId);

        try {
            // 기존 반응이 없다면
            if (existingReaction == null) {
                log.info("새로운 반응: postId={}, userId={}, type={}", postId, userId, requestedType);

                PostRecommendationDTO newReaction = new PostRecommendationDTO();
                newReaction.setPostId(postId);
                newReaction.setUserId(userId);
                newReaction.setReactionType(requestedType);
                newReaction.setCreateAt(LocalDateTime.now());

                // insertPostRecommendation 호출 후, Mybatis가 자동으로 newReaction 객체에 생성된 postRecommendationId를 주입해줍니다.
                postMapper.insertPostRecommendation(newReaction);

                if (requestedType == 1) { // 좋아요
                    postMapper.incrementLikeCount(postId);
                } else { // 싫어요 (-1)
                    postMapper.incrementDislikeCount(postId);
                }
                return true;
            } else {
                Integer existingType = existingReaction.getReactionType();
                if (existingType.equals(requestedType)) { // existingReaction.equals(requestedType) -> existingType.equals(requestedType) 로 변경
                    // 만약 지금 반응하려는게 이전에 반응한거랑 동일하다면 -> 좋아요/싫어요 취소
                    log.info("반응 취소: postId={}, userId={}, type={}", postId, userId, requestedType);
                    postMapper.deletePostRecommendation(postId,userId);

                    if (requestedType == 1) {
                        postMapper.decrementLikeCount(postId);
                    } else {
                        postMapper.decrementDislikeCount(postId);
                    }
                    return true;
                } else {
                    // 좋아요 눌려져있는데 싫어요 누른다면, 또는 반대라면
                    log.info("반응 변경: postId={}, userId={}, 기존 type={}, 요청 type={}", postId, userId, existingType, requestedType);

                    //기존반응삭제
                    postMapper.deletePostRecommendation(postId, userId);
                    if (existingType == 1) { // 기존이 좋아요였으면 좋아요 카운트 감소
                        postMapper.decrementLikeCount(postId);
                    } else { // 기존이 싫어요였으면 싫어요 카운트 감소
                        postMapper.decrementDislikeCount(postId);
                    }
                    // 새로운 반응 추가
                    PostRecommendationDTO newReaction = new PostRecommendationDTO();
                    newReaction.setPostId(postId);
                    newReaction.setUserId(userId);
                    newReaction.setReactionType(requestedType);
                    newReaction.setCreateAt(LocalDateTime.now());

                    // insertPostRecommendation 호출 후, Mybatis가 자동으로 newReaction 객체에 생성된 postRecommendationId를 주입해줍니다.
                    postMapper.insertPostRecommendation(newReaction);

                    if (requestedType == 1) { // 새로운 반응이 좋아요
                        postMapper.incrementLikeCount(postId);
                    } else { // 새로운 반응이 싫어요 (-1)
                        postMapper.incrementDislikeCount(postId);
                    }
                    return true;
                }
            }
        } catch (Exception e) {
            log.error("게시글 반응 처리 중 오류 발생: postId={}, userId={}, type={}", postId, userId, requestedType, e);
            throw new RuntimeException("게시글 반응 처리 실패", e); // 롤백을 위해 런타임 예외 throw
        }
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
