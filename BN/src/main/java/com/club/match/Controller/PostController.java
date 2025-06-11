package com.club.match.Controller;

import com.club.match.Domain.DTO.PostDTO;
import com.club.match.Domain.DTO.PostListResponseDTO;
import com.club.match.Domain.Service.FileService;
import com.club.match.Domain.Service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestPart;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@Slf4j
public class PostController {

    @Autowired
    FileService fileService;

    @Autowired
    PostService postService;

    @Value("${file.upload.root-dir}")
    private String BASE_UPLOAD_ROOT_DIR;

    @Value("${server.url}")
    private String BASE_URL;

    // 커뮤니티 페이지 파일 업로드(temp로)
    @PostMapping("/upload/file")
    public ResponseEntity<?> uploadTempCommunityFile(
            @RequestParam("file") MultipartFile file) {

        log.info("파일 : {}", file);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        log.info("유저아이디 : {}", userId);

        try {
            // temp에 파일 업로드 및 DB에 링크 입력 메서드 실행
            Map<String, Object> serviceResponse = fileService.uploadFile(file, userId);

            // 클라이언트에 반환할 파일 URL 및 원본 파일명
            Map<String, Object> response = new HashMap<>();
            response.put("fileUrl", serviceResponse.get("fileUrl"));
            response.put("fileName", serviceResponse.get("fileName"));
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            log.error("파일 업로드 중 알 수 없는 오류 발생 userId: {}", userId, e);
            return new ResponseEntity<>("파일 업로드 중 알 수 없는 오류 발생", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 저장 버튼 눌렀을 때 작동
    @PostMapping("/post/save")
    public ResponseEntity<?> saveCommunityPost(
            @RequestPart("postDTO") PostDTO postDTO, // 게시글 DTO를 RequestPart로 받음
            @RequestPart(value = "files", required = false) MultipartFile[] files // 파일 목록을 RequestParam으로 받음
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        // 1. 로그인 유무 확인
        if (userId == null) {
            log.warn("인증되지 않은 사용자가 글쓰기 시도. 유효하지 않은 아이디");
            return new ResponseEntity<>("로그인정보가 없습니다.", HttpStatus.UNAUTHORIZED);
        }

        postDTO.setUserId(userId);
        postDTO.setCreateAt(LocalDateTime.now());

        // 2. postCodeId 지정 확인
        if (postDTO.getPostCodeId() == null) {
            log.warn("Bad request: postCodeId 를 찾을 수 없음 : {}", userId);
            return new ResponseEntity<>("게시판 종류(postCodeId)를 지정해야 합니다.", HttpStatus.BAD_REQUEST);
        }

        // 3. postService를 통해 게시글 저장 및 postId 반환
        log.info("게시글 저장 요청 수신: userId={}, title={}", postDTO.getUserId(), postDTO.getTitle());
        try {
            // 게시글 저장 및 postId 획득
            Map<String, Object> serviceResponse = postService.savePost(postDTO, files);

            if (serviceResponse.get("success") != null && (Boolean) serviceResponse.get("success")) {
                Long postId = (Long) serviceResponse.get("postId");
                log.info("게시글이 성공적으로 저장되었습니다. postId: {}", postId);

                return new ResponseEntity<>(serviceResponse, HttpStatus.OK);
            } else {
                String errorMessage = (String) serviceResponse.get("message");
                log.error("게시글 저장 실패: {}", errorMessage);
                return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            log.error("게시글 저장 중 예외 발생: ", e);
            return new ResponseEntity<>("게시글 저장 중 예외 발생", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 게시글 조회
    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getPostDetail(@PathVariable("postId") Long postId) {
        log.info("게시글 상세 조회 요청 수신. postId: {}", postId);
        try {
            PostDTO postDetail = postService.getPostByPostId(postId);

            if (postDetail != null) {
                return new ResponseEntity<>(postDetail, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("게시글을 찾을 수 없습니다.", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            log.error("게시글 상세 조회 중 오류 발생: postId={}, 에러: {}", postId, e.getMessage(), e);
            return new ResponseEntity<>("게시글 상세 조회 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 게시글 좋아요/싫어요 처리 엔드포인트
    @PostMapping("{postId}/react")
    public ResponseEntity<String> handlePostReaction(
            @PathVariable Long postId,
            @RequestBody Map<String,Object> payload) {
        try {
            String userId = payload.get("userId").toString();
            Integer reactionType = (Integer) payload.get("reactionType");

            if (userId == null || reactionType == null) {
                log.warn("필수 파라미터 누락: postId={}, userId={}, reactionType={}", postId, userId, reactionType);
                return new ResponseEntity<>("Required parameters (userId, reactionType) are missing.", HttpStatus.BAD_REQUEST);
            }

            log.info("게시글 반응 요청: postId={}, userId={}, reactionType={}", postId, userId, reactionType);
            boolean success = postService.handlePostReaction(postId, userId, reactionType);

            if (success) {
                return new ResponseEntity<>("Post reaction handled successfully.", HttpStatus.OK);
            } else {
                // 서비스에서 false를 반환하는 경우는 유효하지 않은 reactionType일 때
                return new ResponseEntity<>("Invalid reaction type provided.", HttpStatus.BAD_REQUEST);
            }

        } catch (Exception e) {
            log.error("게시글 반응 처리 중 서버 오류 발생: postId={}, 에러: {}", postId, e.getMessage(), e);
            return new ResponseEntity<>("Failed to handle post reaction due to server error.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    // 게시글 수정
//    @PutMapping("/update/{postId}")
//    public ResponseEntity<Map<String, Object>> updatePost(
//            @PathVariable Long postId,
//            @RequestPart("postDTO") PostDTO postDTO, // JSON 데이터를 PostDTO로 바인딩
//            @RequestPart(value = "files", required = false) List<MultipartFile> files) { // 첨부파일 (선택적)
//        try {
//            // postDTO에 postId 설정 (경로 변수로 받은 postId를 DTO에 넣어주는 것이 일반적)
//            postDTO.setPostId(postId);
//
//            // 서비스 레이어에서 게시글 수정 및 파일 처리 로직 호출
//            PostDTO updatedPost = postService.updatePost(postDTO, files);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("success", true);
//            response.put("message", "게시글이 성공적으로 수정되었습니다.");
//            response.put("postId", updatedPost.getPostId()); // 수정된 게시글 ID 반환
//
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            // 예외 처리 (로그 출력 등)
//            e.printStackTrace();
//            Map<String, Object> errorResponse = new HashMap<>();
//            errorResponse.put("success", false);
//            errorResponse.put("message", "게시글 수정 중 오류가 발생했습니다: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
//        }
//    }

    // 게시글 삭제
    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable Long postId){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();

        // 1. 게시글 존재 여부 및 작성자 일치 여부 확인
        PostDTO postToDelete = postService.getPostByPostId(postId); // 기존 조회 메서드 활용 (삭제 로직에서는 Jsoup 변환 불필요)
        if (postToDelete == null) {
            log.warn("게시글 ID: {} 를 찾을 수 없습니다.", postId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다.");
        }
        if (!postToDelete.getUserId().equals(userId)) {
            log.warn("게시글 ID: {} 삭제 권한 없음: 요청자 {} vs 작성자 {}", postId, userId, postToDelete.getUserId());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("게시글을 삭제할 권한이 없습니다.");
        }
        try {
            // 2. 게시글 삭제 서비스 호출
            postService.deletePost(postId, userId); // 서비스 계층에 삭제 로직 구현

            log.info("게시글 ID: {} 삭제 성공. 요청자: {}", postId, userId);
            return ResponseEntity.ok("게시글이 성공적으로 삭제되었습니다.");
        } catch (Exception e) {
            log.error("게시글 ID: {} 삭제 실패: {}", postId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 삭제 중 오류가 발생했습니다.");
        }
    }

    // 게시글 리스트 조회
    @GetMapping("/list/{postCodeId}")
    public ResponseEntity<PostListResponseDTO> postList(
            @PathVariable Long postCodeId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search) {
        PostListResponseDTO response = postService.getPaginatedPostList(postCodeId, page, limit, search);
        return ResponseEntity.ok(response);
    }
}
