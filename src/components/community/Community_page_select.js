import "../../css/CSS_community-page/community_page_select.css";

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
            <h3 style={{ margin: 0, paddingLeft: 30 }}>댓글</h3>
            <ul className="comment-list">
              <li className="comment-item">
                <p>테스트 댓글 1</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user1</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 2</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 3</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 4</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 5</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 6</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 7</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 8</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 9</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 10</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 11</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 12</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 13</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 14</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 15</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 16</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 17</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 18</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 19</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 20</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user2</span>
                  <span className="comment-date">작성일: 2025.05.05</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 21</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user20</span>
                  <span className="comment-date">작성일: 2025.05.06</span>
                </div>
              </li>
              <li className="comment-item">
                <p>테스트 댓글 22</p>
                <div className="comment-info">
                  <span className="comment-writer">작성자: user21</span>
                  <span className="comment-date">작성일: 2025.05.06</span>
                  {/* 내가 쓴 글만 삭제할 수 있도록 나중에 수정 */}
                  <a
                    href="javascript:void(0)"
                    className="button"
                    id="comment-delete"
                  >
                    삭제
                  </a>
                </div>
              </li>
            </ul>
            {/* 댓글 페이지 번호 */}
            <div className="comment-pagination" />
            <div className="comment-input">
              <input
                type="text"
                placeholder="댓글을 입력하세요"
                id="commentInput"
              />
              <a
                href="javascript:void(0)"
                className="button"
                id="commentSubmit"
              >
                등록
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community_page_select;
