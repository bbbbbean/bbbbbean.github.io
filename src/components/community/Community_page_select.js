import "../../css/CSS_community-page/community_page_select.css";
import Comment from "./Comment"

const Community_page_select = () => {
  return (
    <div className="forum-wrap">
      <div className="forum">
        <div className="forum-menu">
          <div className="forum-menu-el">
            <a href="javascript:void(0)">운동</a>
            <a href="javascript:void(0)" className="on">
              게임
            </a>
            <a href="javascript:void(0)">여행</a>
            <a href="javascript:void(0)">취미</a>
            <a href="javascript:void(0)">자유게시판</a>
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
            <h2 className="view-title">게시판 테스트입니다</h2>
            <div className="view-info">
              {/* 작성자 클릭하면 작성글 보기 등을 만들기 */}
              <span className="info-writer">작성자: a1234</span>
              <span className="info-date">작성일: 2025.05.05</span>
              <span className="info-hit">조회수: 100</span>
              <span className="info-like">추천: 25</span>
            </div>
          </div>
          <hr className="view-divider" />
          <div className="view-content">
            <p>테스트 내용</p>
            <img src="../../static/image/로고.png" alt="" />
            <p>테스트 내용 2</p>
          </div>
          <hr className="view-divider" />
          <div className="view-buttons">
            {/* 권한 등에 따라 표시하기 */}
            <a href="javascript:void(0)" className="button">
              목록
            </a>
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
