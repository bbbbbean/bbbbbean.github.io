import { useState } from "react";
import "../../css/CSS_community-page/community_page_list.css";
import { Link } from "react-router-dom";

const Community_list = () => {
  const [selectedMenu, setSelectedMenu] = useState("자유게시판");
  const handlerSelectMenu = (e) => {
    console.log(e.target.innerText);
    const selected = e.target.innerText;
    setSelectedMenu(selected);
    const menuItems = document.querySelectorAll(".forum-menu-el a");
    menuItems.forEach((item) => {
      if (item.innerText === selected) {
        item.classList.add("on");
      } else {
        item.classList.remove("on");
      }
    });
  };
  return (
    <div className="forum-wrap">
      <div className="forum">
        <div className="forum-menu">
          <div className="forum-menu-el">
            <Link onClick={handlerSelectMenu}>운동</Link>
            <Link onClick={handlerSelectMenu}>여행</Link>
            <Link onClick={handlerSelectMenu}>취미</Link>
            <Link onClick={handlerSelectMenu}>게임</Link>
            <Link className="on" onClick={handlerSelectMenu}>
              자유게시판 {/* 디폴트  */}
            </Link>
          </div>
          <div className="forum-menu-serch">
            <input type="text" placeholder="검색어를 입력하세요" />
            <a href="javascript:void(0)">
              <img
                src="../../static/image/image_event/search_icon.svg"
                alt=""
              />
            </a>
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
          <li className="forum-main-el">
            //{/* 게시글 연결 */}
            <a href="javascript:void(0)" className="forum-main-grid">
              <p>1</p>
              <p>게시판테스트입니다</p>
              <p>10</p>
              <p>20</p>
              <p>a1234</p>
              <p>25.03.24</p>
            </a>
          </li>
        </ul>
        <ul className="forum-listnum">
          <div className="page">
            <div>
              <a href="javascript:void(0)" className="dirction-button">
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
              </a>
            </div>
            <div className="page-list">
              {/* class="list-on" 설정해주면 눌렀을 때 css반영 */}
              <a href="javascript:void(0)" className="list-on">
                1
              </a>
              <a href="javascript:void(0)">2</a>
              <a href="javascript:void(0)">3</a>
              <a href="javascript:void(0)">4</a>
              <a href="javascript:void(0)">5</a>
              <a href="javascript:void(0)">6</a>
            </div>
            <div>
              <a href="javascript:void(0)" className="dirction-button">
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
              </a>
            </div>
          </div>
          <div className="forum-write">
            <a href="javascript:void(0)"> 글쓰기</a>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Community_list;
