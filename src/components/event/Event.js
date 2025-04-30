import searchIcon from "../../image/image_event/search_icon.svg";
import "../../css/event/event.css";

const EventPage = () => {
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
          <ul className="event-board-menu">
            <li>
              <ul className="event-board-menu-el">
                <li>
                  <a href="#" className="on">
                    공지사항
                  </a>
                </li>
                <li>
                  <a href="#">이벤트</a>
                </li>
              </ul>
            </li>
            <li className="event-board-menu-serch">
              <input type="text" />
              <a href="#">
                <img src={searchIcon} alt="검색" />
              </a>
            </li>
          </ul>
  
          <ul className="event-board-main">
            <li className="event-board-main-grid">
              <p>글번호</p>
              <p>제목</p>
              <p>조회수</p>
              <p>작성일</p>
            </li>
            {[...Array(10)].map((_, idx) => (
              <li key={idx} className="event-board-main-el">
                <a href="#" className="event-board-main-grid">
                  <p>1111</p>
                  <p>공지사항입니다</p>
                  <p>10</p>
                  <p>25.03.14</p>
                </a>
              </li>
            ))}
          </ul>
  
          <ul className="event-board-listnum">
            <li>
              <a href="#">이전 페이지</a>
            </li>
            <ul>
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <li key={num}>
                  <a href="#" className={num === 1 ? "list-on" : ""}>
                    {num}
                  </a>
                </li>
              ))}
            </ul>
            <li>
              <a href="#">다음 페이지</a>
            </li>
          </ul>
        </div>
      </div>
    );
  };
  
  export default EventPage;