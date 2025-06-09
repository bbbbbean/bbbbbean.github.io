import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/CSS_community-page/community_page_list.css";

const Community_page_list = () => {
  const [selectedMenu, setSelectedMenu] = useState(5);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어 상태

  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/list", {
        params: {
          category: selectedMenu, // 선택된 메뉴 (게시판 종류)
          page: currentPage, // 현재 페이지 번호
          limit: 10, // 한 페이지당 게시글 수
          search: searchKeyword, // 검색어
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
  }, [selectedMenu, currentPage, searchKeyword]);

  // 초기 렌더링
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 게시판 메뉴 클릭시
  const handlerSelectMenu = (e) => {
    const selected = Number(e.currentTarget.dataset.type);
    console.log("선택한 게시글 타입 :", selected);
    setSelectedMenu(selected);
    setCurrentPage(1);
    setSearchKeyword("");
  };

  // 검색어 입력
  const handleSearchInputChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 검색 버튼 클릭
  const handleSearchSubmit = () => {
    setCurrentPage(1); // 검색 시 페이지를 1로 초기화
    fetchPosts(); // 검색 결과 다시 불러오기
  };

  // 페이지 번호 클릭
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // 글쓰기 버튼 클릭
  const handleWriteClick = () => {
    navigate("/community/write"); // 글쓰기 페이지 경로로 이동
  };

  // 게시글 클릭 핸들러
  const handlePostClick = (postId) => {
    navigate(`/community/view/${postId}`); // 게시글 상세 페이지 경로로 이동
  };

  // 로딩 및 에러 상태 처리
  if (loading) {
    return <div className="forum-wrap">게시글을 불러오는 중...</div>;
  }
  if (error) {
    return <div className="forum-wrap error-message">{error}</div>;
  }

  // 카테고리 매핑 (숫자 ID와 이름 매핑)
  const categories = [
    { id: 1, name: "운동" },
    { id: 2, name: "여행" },
    { id: 3, name: "취미" },
    { id: 4, name: "게임" },
    { id: 5, name: "자유게시판" },
  ];

  return (
    <div className="forum-wrap">
      <div className="forum">
        <div className="forum-menu">
          <div className="forum-menu-el">
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
          </div>
          <div className="forum-menu-serch">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchKeyword}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit();
                }
              }}
            />
            <button onClick={handleSearchSubmit} className="search-button">
              <img
                src="../../static/image/image_event/search_icon.svg"
                alt=""
              />
            </button>
          </div>
        </div>
        <ul className="forum-main">
          <li className="forum-main-grid">
            <p>글번호</p>
            <p>제목</p>
            <p>추천</p>
            <p>조회수</p>
            <p>작성자</p>
            <p>작성일</p>
          </li>
          {posts.length > 0 ? (
            posts.map((post) => (
              <li key={post.postId} className="forum-main-el">
                <link
                  onClick={() => handlePostClick(post.postId)}
                  className="forum-main-grid"
                >
                  <p>{post.postId}</p>
                  <p>{post.title}</p>
                  <p>{post.likeCount}</p>
                  <p>{post.viewCount}</p>
                  <p>{post.nickName}</p>
                  <p>{new Date(post.createAt).toLocaleDateString()}</p>
                </link>
              </li>
            ))
          ) : (
            <li className="forum-main-no-posts">
              <p>게시글이 없습니다.</p>
            </li>
          )}
        </ul>
        <ul className="forum-listnum">
          <div className="page">
            <div>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
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
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
            </div>
            <div className="page-list">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={currentPage === pageNumber ? "list-on" : ""}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>
            <div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
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
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="forum-write">
            <link onClick={handleWriteClick}> 글쓰기</link>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Community_page_list;
