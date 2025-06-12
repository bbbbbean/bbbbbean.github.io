import React, { useState, useEffect, useCallback } from "react"; // React Hooks 임포트
import { NavLink, useParams, useNavigate } from "react-router-dom";
import api from "../../axios";
import "../../css/CSS_community-page/community_page_select.css";
import Comment from "./Comment";

const Community_page_select = () => {
  const { postNumber } = useParams();
  const [postId] = useState(postNumber);
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPostCategoryId, setCurrentPostCategoryId] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(5);

  const currentUserId = localStorage.getItem("userId");

  // Quill 에디터 내용(HTML)을 안전하게 렌더링하기 위한 함수
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  // 게시글 데이터를 불러오는 함수
  const fetchPost = useCallback(async () => {
    try {
      setLoading(true); // 로딩 시작
      setError(null); // 이전 에러 초기화

      const response = await api.get(`/post/${postId}`);
      setPost(response.data);
      setCurrentPostCategoryId(response.data.postCodeId);
      setSelectedMenu(response.data.postCodeId);
      console.log("포스트아이디 :", postId);
      console.log("포스트 코드 아이디 : ", response.data.postCodeId);
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

  // 좋아요/싫어요 반응 처리 함수
  const handleReaction = async (reactionType) => {
    if (!currentUserId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    try {
      const response = await api.post(`/${postId}/react`, {
        userId: currentUserId,
        reactionType: reactionType,
      });

      console.log("반응 처리 성공:", response.data);
      alert(`반응이 성공적으로 처리되었습니다: ${response.data}`);
      fetchPost();
    } catch (err) {
      console.error("반응 처리 오류:", err);
      if (err.response && err.response.data) {
        alert(`반응 처리 실패: ${err.response.data}`);
      } else {
        alert("반응 처리 중 오류가 발생했습니다.");
      }
    }
  };

  // "목록" 버튼 클릭 핸들러
  const handleListClick = () => {
    if (post && post.postCodeId) {
      navigate(`/community/list/${post.postCodeId}`);
    } else {
      // postCodeId를 알 수 없다면, 기본 자유게시판으로 이동
      navigate("/community/list/5");
    }
  };

  // 수정 버튼 클릭 핸들러
  const EditPost = async () => {
    if (post && post.postId) {
      navigate(`/community/edit/${post.postId}`);
    }
  };

  // 삭제 버튼 클릭 핸들러
  const deletePost = async () => {
    // 사용자에게 삭제 확인 받기
    if (!window.confirm("정말 게시글을 삭제하시겠습니까?")) {
      return; // 사용자가 취소하면 함수 종료
    }
    try {
      const response = await api.delete(`/${postId}`);
      console.log("게시글 삭제 성공!", response.data);
      alert(`게시글이 성공적으로 삭제되었습니다 : ${response.data}`);
      navigate("/community/list");
    } catch (err) {
      console.error("게시글 삭제 실패 :", err);
      if (err.response && err.response.data) {
        alert("게시글 삭제 실패 :  ${err.response.data}");
      } else {
        alert("게시글 삭제 실패! 알 수 없는 오류 발생");
      }
    }
  };

  // 게시판 메뉴 클릭시
  const handlerSelectMenu = (e) => {
    const selected = Number(e.currentTarget.dataset.type);
    setSelectedMenu(selected);
    console.log("선택한 게시글 타입 :", selected);
    navigate(`/community/list/${selected}`);
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

  const categories = [
    { id: 1, name: "운동" },
    { id: 2, name: "게임" },
    { id: 3, name: "취미" },
    { id: 4, name: "여행" },
    { id: 5, name: "자유게시판" },
  ];

  // 데이터 로드 성공 시 게시글 렌더링
  return (
    <div className="forum-wrap">
      <div className="forum">
        <div className="forum-menu">
          <div className="forum-menu-el">
            {categories.map((category) => (
              <NavLink
                key={category.id}
                to={`/community/list/${category.id}`}
                data-type={category.id}
                onClick={handlerSelectMenu}
                className={({ isActive }) =>
                  isActive || selectedMenu === category.id ? "on" : ""
                }
              >
                {category.name}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="forum-view">
          <div className="view-header">
            <h2 className="view-title">{post.title}</h2>
            <div className="view-info">
              <span className="info-writer">작성자: {post.nickName}</span>
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
              <span className="info-like">좋아요 : {post.likeCount || 0}</span>
              <span className="info-dislike">
                싫어요 : {post.dislikeCount || 0}
              </span>
            </div>
          </div>
          <hr className="view-divider" />
          <div
            className="view-content"
            dangerouslySetInnerHTML={createMarkup(post.content)}
          />

          {/* 첨부 파일 영역 */}
          {post && currentUserId && (
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
            <button onClick={() => handleReaction(1)} className="button">
              좋아요 ({post.likeCount || 0})
            </button>
            <button onClick={() => handleReaction(-1)} className="button">
              싫어요 ({post.dislikeCount || 0})
            </button>
            {currentUserId && post && currentUserId == post.userId && (
              <>
                <button onClick={EditPost} className="button">
                  수정
                </button>
                <button onClick={deletePost} className="button">
                  삭제
                </button>
              </>
            )}
          </div>
          {/* 댓글 개수 한 30개 정도 나오면 페이지 스위칭으로 이동 */}
          <div className="view-comment">
            <Comment postId={postId} />
            {/* 댓글 페이지 번호 */}
            <div className="comment-pagination" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community_page_select;
