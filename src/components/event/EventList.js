import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import api from "../../axios";
import "../../css/event_css/EventList.css";
import searchIcons from "../../../src/image/image_event/search_icon.svg";

const EventList = () => {
  const { postCodeId } = useParams();
  const [selectedMenu, setSelectedMenu] = useState(() => {
    return postCodeId ? Number(postCodeId) : 6;
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const searchInputRef = useRef(null);

  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:8100";

  const PAGES_PER_BLOCK = 10;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const currentSearchKeyword = searchInputRef.current
        ? searchInputRef.current.value
        : "";

      const url = API_BASE_URL + "/list/" + selectedMenu;
      console.log(
        "링크 : ",
        url,
        "페이지 :",
        currentPage,
        "검색어 :",
        currentSearchKeyword,
        "현재 selectedMenu :",
        selectedMenu
      );
      console.log("포스트코드 넘버", postCodeId);
      const response = await api.get(url, {
        params: {
          page: currentPage, // 현재 페이지 번호
          limit: 10, // 한 페이지당 게시글 수
          search: currentSearchKeyword, // 검색어
        },
      });
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("게시글 목록 불러오기 실패:", err);
      setError(
        err.response?.data?.message || "게시글을 불러오는 데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedMenu, currentPage, postCodeId]);

  // 메뉴 버튼 눌러서 바뀌었을 때
  useEffect(() => {
    const newMenuId = postCodeId ? Number(postCodeId) : 5;
    if (newMenuId !== selectedMenu) {
      setSelectedMenu(newMenuId);
    }
    setCurrentPage(1);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  }, [postCodeId]);

  // 재렌더링 조건
  // 메뉴 눌렀을 때, 페이지 이동했을 때, 검색어 입력 후 엔터했을때
  useEffect(() => {
    fetchPosts();
  }, [selectedMenu, currentPage, fetchPosts]);

  // 게시판 메뉴 클릭시
  const handlerSelectMenu = (e) => {
    const selected = Number(e.currentTarget.dataset.type);
    console.log("선택한 게시글 타입 :", selected);
    setSelectedMenu(selected);
    console.log("바꾼거", selectedMenu);
    setCurrentPage(1);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    navigate(`/community/list/${selected}`);
  };

  // 검색 버튼 클릭
  const handleSearchSubmit = () => {
    setCurrentPage(1); // 검색 시 페이지를 1로 초기화
    fetchPosts();
  };

  // 페이지 번호 클릭
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      fetchPosts();
    }
  };

  // 페이지네이션 로직 추가
  // 현재 페이지 블록의 시작 페이지 계산
  const startPage =
    Math.floor((currentPage - 1) / PAGES_PER_BLOCK) * PAGES_PER_BLOCK + 1;
  // 현재 페이지 블록의 끝 페이지 계산
  const endPage = Math.min(startPage + PAGES_PER_BLOCK - 1, totalPages);

  // 페이지 번호 배열 생성
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // 로딩 및 에러 상태 처리
  if (loading) {
    return <div className="event-wrap">게시글을 불러오는 중...</div>;
  }
  if (error) {
    return <div className="event-wrap error-message">{error}</div>;
  }

  // 카테고리 매핑 (숫자 ID와 이름 매핑)
  const categories = [
    { id: 1, name: "운동" },
    { id: 2, name: "게임" },
    { id: 3, name: "취미" },
    { id: 4, name: "여행" },
    { id: 5, name: "자유게시판" },
  ];

  return (
    <div className="event-wrap">
      <div className="event-section">
        <span>
          진행 중인 <p>이벤트</p>
        </span>
        <ul>
          {[...Array(3)].map((_, idx) => (
            <li key={idx}>
              <a href="#">
                <p>신규회원 이벤트!</p>
                <p>이벤트 배너</p>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="event-board">
        <div className="event-board-menu">
          <div className="event-board-menu-el">
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
          <div className="event-board-menu-serch">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              ref={searchInputRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit();
                }
              }}
            />
            <button onClick={handleSearchSubmit} className="search-button">
              <img src={searchIcons} alt="검색" />
            </button>
          </div>
        </div>
        <ul className="event-board-main">
          <li className="event-board-main-grid event-board-header">
            <p>글번호</p>
            <p>제목</p>
            <p>좋아요</p>
            <p>싫어요</p>
            <p>조회수</p>
            <p>작성자</p>
            <p>작성일</p>
          </li>
          {posts.length > 0 ? (
            posts.map((post) => (
              <li key={post.postId} className="event-board-main-el">
                <Link
                  to={`/community/select/${post.postId}`}
                  className="event-board-main-grid clickable-post-row"
                >
                  <p>{post.postId}</p>
                  <p>{post.title}</p>
                  <p>{post.likeCount}</p>
                  <p>{post.dislikeCount}</p>
                  <p>{post.viewCount}</p>
                  <p>{post.nickName}</p>
                  <p>{new Date(post.createAt).toLocaleDateString()}</p>
                </Link>
              </li>
            ))
          ) : (
            <li className="event-board-main-no-posts">
              <p>게시글이 없습니다.</p>
            </li>
          )}
        </ul>
        <ul className="event-board-listnum">
          <div className="page">
            {/* << 버튼 */}
            <div>
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="dirction-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                  />
                </svg>
              </button>
            </div>
            {/* < 버튼 */}
            <div>
              <button
                onClick={() => handlePageChange(startPage - 1)}
                disabled={startPage === 1}
                className="dirction-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
            </div>
            {/* 페이지 숫자 */}
            <div className="page-list">
              {totalPages > 0 &&
                pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={currentPage === pageNumber ? "list-on" : ""}
                  >
                    {pageNumber}
                  </button>
                ))}
            </div>
            {/* > (다음 블록) 버튼 */}
            <div>
              <button
                onClick={() => handlePageChange(endPage + 1)}
                disabled={endPage === totalPages}
                className="dirction-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
            {/* >> (제일 마지막) 버튼 */}
            <div>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="dirction-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
          {localStorage.getItem("isAuth") && (
            <div className="event-board-write">
              <NavLink
                to={`/community/write/${postCodeId}`}
                className="write-button"
              >
                글쓰기
              </NavLink>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EventList;
