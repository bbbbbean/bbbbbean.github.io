package com.club.match.Domain.Service;

import com.club.match.Domain.DTO.*;
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
import java.nio.file.Files;
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

    // 게시글 리스트 조회
    public PostListResponseDTO getPaginatedPostList(Long postCodeId, int page, int limit, String searchKeyword) {
        // offset 계산
        int offset = (page - 1) * limit;

        // 게시글 목록 조회
        List<PostListDTO> posts = postMapper.selectPostList(postCodeId, offset, limit, searchKeyword);

        // 총 게시글 수 조회
        int totalElements = postMapper.countPosts(postCodeId, searchKeyword);

        // 총 페이지 수 계산
        int totalPages = (int) Math.ceil((double) totalElements / limit);

        // 응답 DTO 생성 및 반환
        return new PostListResponseDTO(posts, totalPages, totalElements);

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
            PostDTO post = new PostDTO();
            post.setPostId(postDetail.getPostId());
            post.setUserId(postDetail.getUserId());
            post.setNickName(postDetail.getNickName());
            post.setTitle(postDetail.getTitle());
            post.setPostCategory(postDetail.getPostCategory());

            String originalContent = postDetail.getContent();
            if (originalContent != null && !originalContent.isEmpty()) {
                String modifiedContent = modifyImageSrcWithPostId(originalContent, postId, postDetail.getUserId());
                post.setContent(modifiedContent);
            } else {
                post.setContent(originalContent);
            }
            post.setCreateAt(postDetail.getCreateAt());
            post.setViewCount(postDetail.getViewCount());
            post.setPostCodeId(postDetail.getPostCodeId());
            post.setLikeCount(postDetail.getLikeCount());
            post.setDislikeCount(postDetail.getDislikeCount());
            post.setAttachments(attachments); // 첨부 파일 목록 설정

             if (attachments != null) {
                 for (AttachmentFileDTO attachment : attachments) {
                     // 파일명만 있는 경우, 올바른 URL로 재구성
                     String originalUrl = attachment.getAttachmentUrl(); // 예: /user1/community/파일명.png
                     String filename = originalUrl.substring(originalUrl.lastIndexOf('/') + 1); // 파일명 추출
                     String newUrl = BASE_URL + post.getUserId() + "/community/" + postId + "/" + filename;
                     attachment.setAttachmentUrl(newUrl);
                 }
             }
            log.info("게시글 ID: {} 상세 정보 조회 성공. 제목: {}, 첨부 파일 수: {}",
                    postId, post.getTitle(), post.getAttachments() != null ? post.getAttachments().size() : 0);
            return post;
        }
    }

    // 게시글 Url 주소 바꾸는 기능
    private String modifyImageSrcWithPostId(String htmlContent, Long postId, String userId) {
        Document doc = Jsoup.parse(htmlContent); // HTML 파싱
        Elements images = doc.select("img[src]"); // 모든 <img> 태그 중 src 속성이 있는 것 선택

        String expectedPathPrefix = userId + "/community/";

        for (Element img : images) {
            String originalSrc = img.attr("src");

            // 1. 이미 올바른 postId 경로를 포함하고 있는지 (예: "/community/2/파일명.png")
            if (originalSrc.contains("/community/" + postId + "/")) {
                continue; // 이미 처리된 URL이므로 스킵
            }

            // 2. 'http://localhost:8100/user1/community/파일명.png' 형태의 src를 찾아서 수정
            // 예: "http://localhost:8100/user1/community/abc.png"
            if (originalSrc.startsWith(BASE_URL + expectedPathPrefix)) {
                String filename = originalSrc.substring((BASE_URL + expectedPathPrefix).length());
                String newSrc = BASE_URL + expectedPathPrefix + postId + "/" + filename;
                img.attr("src", newSrc);
                log.debug("Modified image src from {} to {}", originalSrc, newSrc);
            }
            // originalSrc가 BASE_URL 없이 바로 /userId/community/파일명.png 형태로 저장된 경우
            // 예: "/user1/community/abc.png"
            else if (originalSrc.startsWith(expectedPathPrefix)) {
                String filename = originalSrc.substring(expectedPathPrefix.length());
                String newSrc = BASE_URL + expectedPathPrefix + postId + "/" + filename;
                img.attr("src", newSrc);
                log.debug("Modified image src from {} to {}", originalSrc, newSrc);
            }
            else {
                // 예상치 못한 형식의 이미지 src는 수정하지 않고 로그만 남김
                log.warn("Image src not matching expected pattern for modification: {}", originalSrc);
            }
        }

        return doc.html(); // 수정된 HTML 문자열 반환
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

                // postRecommendation_tbl 을 업데이트
                PostRecommendationDTO newReaction = new PostRecommendationDTO();
                newReaction.setPostId(postId);
                newReaction.setUserId(userId);
                newReaction.setReactionType(requestedType);
                newReaction.setCreateAt(LocalDateTime.now());
                postMapper.insertPostRecommendation(newReaction);

                // post_tbl 을 업데이트
                if (requestedType == 1) { // 좋아요
                    postMapper.incrementLikeCount(postId);
                } else { // 싫어요 (-1)
                    postMapper.incrementDislikeCount(postId);
                }
                return true;
            } else {
                Integer existingType = existingReaction.getReactionType();
                if (existingType.equals(requestedType)) {
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

//    // 게시글 수정
//    @Transactional(rollbackFor = Exception.class)
//    public PostDTO updatePost(PostDTO postDTO, List<MultipartFile> files) throws Exception {
//        // 1. 필수 값 검증 (postId, userId, title, content)
//        Objects.requireNonNull(postDTO.getPostId(), "Post ID must not be null for update.");
//        Objects.requireNonNull(postDTO.getUserId(), "User ID must not be null.");
//        Objects.requireNonNull(postDTO.getTitle(), "Title must not be null.");
//        Objects.requireNonNull(postDTO.getContent(), "Content must not be null.");
//
//        // 2. 게시글 존재 여부 및 작성자 일치 여부 확인 (권한 확인)
//        // 현재 게시글의 작성자 ID와 DTO의 userId가 일치하는지 확인
//        PostDetailResultDTO existingPost = postMapper.selectPostByPostId(postDTO.getPostId());
//        if (existingPost == null) {
//            throw new IllegalArgumentException("게시글을 찾을 수 없습니다.");
//        }
//        // 로그인 유저의 ID와 게시글 작성자 ID 비교
//        if (!existingPost.getUserId().equals(postDTO.getUserId())) {
//            throw new IllegalAccessException("게시글을 수정할 권한이 없습니다."); // 403 Forbidden
//        }
//
//        // 3. 게시글 정보 업데이트
//        // PostMapper에 게시글 정보를 업데이트하는 메서드를 호출합니다.
//        int rowsAffected = postMapper.updatePost(postDTO); // postDTO를 인자로 넘김
//        if (rowsAffected == 0) {
//            throw new RuntimeException("게시글 업데이트에 실패했습니다. (DB 반영 실패)");
//        }
//        log.info("게시글 ID {}가 성공적으로 업데이트되었습니다.", postDTO.getPostId());
//
//        // 4. 첨부 파일 처리
//        fileService.updateFilesForPost(postDTO.getPostId(), postDTO.getContent(), files); // 예시 메서드명
//
//        log.info("게시글 ID {}의 파일 처리가 완료되었습니다.", postDTO.getPostId());
//
//        return postDTO; // 업데이트된 DTO 반환 또는, 필요하다면 DB에서 최신 정보를 다시 조회하여 반환
//    }

    // 게시글 삭제
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> deletePost(Long postId, String userId) {
        Map<String, Object> resp = new HashMap<>();
        try {
            fileService.deleteAttachmentFile(postId,userId);
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
