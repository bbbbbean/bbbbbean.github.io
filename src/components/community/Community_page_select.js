import React, { useState, useEffect, useCallback } from "react"; // React Hooks 임포트
import { useParams, useNavigate } from "react-router-dom"; // useParams 추가, useNavigate 추가
import axios from "axios"; // axios 임포트
import { api } from "../../axios"; // 가정 (인증 토큰 등을 사용하는 axios 인스턴스)

import "../../css/CSS_community-page/community_page_select.css";
import Comment from "./Comment";

const Community_page_select = () => {
  const { postId } = useParams();
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quill 에디터 내용(HTML)을 안전하게 렌더링하기 위한 함수
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  // 게시글 데이터를 불러오는 함수
  const fetchPost = useCallback(async () => {
    try {
      setLoading(true); // 로딩 시작
      setError(null); // 이전 에러 초기화

      const response = await api.get(`/community/post/${postId}`);
      setPost(response.data);
      console.log("게시글 데이터 로드 성공:", response.data);
    } catch (err) {
      console.error("게시글 로드 실패:", err);
      // HTTP 상태 코드에 따른 구체적인 에러 메시지
      if (err.response) {
        if (err.response.status === 404) {
          setError("요청하신 게시글을 찾을 수 없습니다.");
        } else if (err.response.status === 500) {
          setError("서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setError(
            `오류 발생: ${err.response.status} ${err.response.statusText}`
          );
        }
      } else if (err.request) {
        setError(
          "서버로부터 응답을 받지 못했습니다. 네트워크 연결을 확인해주세요."
        );
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false); // 로딩 종료
    }
  }, [postId]); // postId가 변경될 때마다 함수 재생성

  useEffect(() => {
    if (postId) {
      fetchPost();
    } else {
      setError("게시글 ID가 제공되지 않았습니다.");
      setLoading(false);
    }
  }, [postId, fetchPost]);

  // "목록" 버튼 클릭 핸들러
  const handleListClick = () => {
    navigate("/community"); // 또는 '/community/list' 등 목록 페이지 경로로 이동
  };

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="forum-wrap">
        <div className="forum">
          <div className="forum-view">
            <p className="loading-message">게시글을 불러오는 중입니다...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <div className="forum-wrap">
        <div className="forum">
          <div className="forum-view">
            <p className="error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // 게시글 데이터가 없을 때 (404 Not Found는 이미 error로 처리되지만, 만약을 대비)
  if (!post) {
    return (
      <div className="forum-wrap">
        <div className="forum">
          <div className="forum-view">
            <p className="not-found-message">게시글을 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  // 데이터 로드 성공 시 게시글 렌더링
  return (
    <div className="forum-wrap">
      <div className="forum">
        <div className="forum-menu">
          <div className="forum-menu-el">
            <a
              href="javascript:void(0)"
              className={post.postCategory === "운동" ? "on" : ""}
            >
              운동
            </a>
            <a
              href="javascript:void(0)"
              className={post.postCategory === "게임" ? "on" : ""}
            >
              게임
            </a>
            <a
              href="javascript:void(0)"
              className={post.postCategory === "여행" ? "on" : ""}
            >
              여행
            </a>
            <a
              href="javascript:void(0)"
              className={post.postCategory === "취미" ? "on" : ""}
            >
              취미
            </a>
            <a
              href="javascript:void(0)"
              className={post.postCategory === "자유게시판" ? "on" : ""}
            >
              자유게시판
            </a>
          </div>
          <div className="forum-menu-serch">
            <input type="text" placeholder="검색어를 입력하세요" />
            <a href="javascript:void(0)">
              <img
                src="../../static/image/image_event/search_icon.svg"
                alt="검색"
              />
            </a>
          </div>
        </div>
        <div className="forum-view">
          <div className="view-header">
            <h2 className="view-title">{post.title}</h2>
            <div className="view-info">
              <span className="info-writer">작성자: {post.userNickName}</span>
              {/* 날짜 형식 포맷팅 (예: 2025-05-05T10:30:00 -> 2025.05.05 10:30) */}
              <span className="info-date">
                작성일:{" "}
                {new Date(post.createAt)
                  .toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .replace(/\. /g, ".")
                  .replace(/\./g, ". ")
                  .trim()}
              </span>
              <span className="info-hit">조회수: {post.viewCount}</span>
              {/* 추천수는 postRecommendation_tbl에서 가져와야 하므로, 현재 PostDTO에는 없음. 추후 필요하다면 백엔드 API 및 DTO 수정 필요 */}
              <span className="info-like">추천: 0</span>
            </div>
          </div>
          <hr className="view-divider" />
          <div
            className="view-content"
            dangerouslySetInnerHTML={createMarkup(post.content)}
          />

          {/* 첨부 파일 영역 */}
          {post.attachments && post.attachments.length > 0 && (
            <div className="post-attachments">
              <h3>첨부 파일</h3>
              <ul>
                {post.attachments.map((file) => (
                  <li key={file.postAttachmentId}>
                    <a
                      href={file.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file.originalFileName}
                    </a>{" "}
                    ({file.contentType})
                  </li>
                ))}
              </ul>
            </div>
          )}
          <hr className="view-divider" />
          <div className="view-buttons">
            <a
              href="javascript:void(0)"
              className="button"
              onClick={handleListClick}
            >
              목록
            </a>
            {/* 수정/삭제 버튼은 사용자 권한 및 작성자 여부에 따라 표시 로직 추가 필요 */}
            {/* 예: currentUserId === post.userId && ( ... ) */}
            <a href="javascript:void(0)" className="button">
              수정
            </a>
            <a href="javascript:void(0)" className="button">
              삭제
            </a>
          </div>
          {/* 댓글 개수 한 30개 정도 나오면 페이지 스위칭으로 이동 */}
          <div className="view-comment">
            <Comment />
            {/* 댓글 페이지 번호 */}
            <div className="comment-pagination" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community_page_select;
