import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import UserCalendar from "./calendar/UserCalendar";

import "../css/common_css/main_main.css";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import searchIcon from "../image/image_main/serch-icon.svg";
import chatIcon from "../image/image_main/chat-icon.svg";
import calendarIcon from "../image/image_main/calendar-icon.svg";
import callIcon from "../image/image_main/call-icon.svg";
import MatchModal from "./match/matchModal";
import Calendar from "react-calendar";

const Main = () => {

  useEffect(() => {
    const mainMatchlistEls = document.querySelectorAll(".main-matchlist-els");

    mainMatchlistEls.forEach((item) => {
      item.addEventListener("click", handleModal);
    });
  }, []);

  // 모달 상태 관리
  const [selectMatch, setMatchList] = useState(null);

  const handleModal = (e) => {
    setMatchList(e.target.classList[1]);
  }

  selectMatch != null ? document.body.classList.add("stop-scrolling") : document.body.classList.remove("stop-scrolling");


  // 상태 관리: accordion 열기/닫기
  const [activeAccordion, setActiveAccordion] = useState(null);

  const handleAccordionClick = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index); // 클릭 시 열고 닫기
  };
  return (
    <>
      <main>
        <section className="main">
          <div className="banner-section">
            {/* Swiper component */}
            <Swiper
              spaceBetween={50}
              centeredSlides={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              className="mySwiper"
            >
              <SwiperSlide>Slide 1</SwiperSlide>
              <SwiperSlide>Slide 2</SwiperSlide>
              <SwiperSlide>Slide 3</SwiperSlide>
              <SwiperSlide>Slide 4</SwiperSlide>
              <SwiperSlide>Slide 5</SwiperSlide>
              <SwiperSlide>Slide 6</SwiperSlide>
              <SwiperSlide>Slide 7</SwiperSlide>
              <SwiperSlide>Slide 8</SwiperSlide>
              <SwiperSlide>Slide 9</SwiperSlide>
            </Swiper>
          </div>

          <div className="main-wording-section">
            <div className="main-wording">
              <span>
                <p className="semibold">딱</p>맞는 사람들과 <p className="bold">MATCH!</p>
              </span>
              <span>
                즐겁게! 다함께! <p className="bold">PLAY!</p>
              </span>
            </div>
            <div className="main-wording-box">
              <ul>
                <li>테니스</li>
                <li>힐링 해외 여행</li>
                <li className="main-imoji">👋</li>
              </ul>
              <ul>
                <li className="main-sky">축구</li>
                <li>배틀 그라운드</li>
                <li>레고</li>
              </ul>
              <ul>
                <li>방탈출</li>
                <li className="main-imoji">🤩</li>
                <li className="main-orange">패러글라이딩</li>
              </ul>
              <ul>
                <li>보드게임</li>
                <li>풋볼</li>
                <li className="main-imoji">🚗</li>
                <li>온라인</li>
              </ul>
            </div>
          </div>

          <div className="main-serch">
            <span>지금 나만의 <p className="semibold">MATCH</p>를 찾는다면?</span>
            {/* 검색창 */}
            <ul className="serch-bar">
              <li className="main-search-input">
                {/* 글자수 제한 */}
                <input type="text" placeholder="검색어를 입력하세요" />
              </li>
              <li className="main-search-btn">
                <button>
                  <img src={searchIcon} alt="돋보기" />
                </button>
              </li>
            </ul>
          </div>

          <div className="main-ranking">
            <div className="main-rank">
              <div className="main-rank-title">
                <span>
                  지금 <p>PLAY 친구</p>들의 <p>관심사</p>는?
                </span>
                <div className="main-textbox main-sky"></div>
              </div>
              <ul className="main-rank-els">
                {['달리기', '보드게임', '발로란트', '배드민턴', '당일치기'].map((item, index) => (
                  <li className="main-rank-el" key={index}>
                    <ul>
                      <li className="main-rank-el-num">{index + 1}</li>
                      <li className="main-rank-el-con">{item}</li>
                      <li className="main-rank-el-go">
                        <a className="main-sky">
                          <img src={searchIcon} alt="돋보기" />
                        </a>
                      </li>
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
            <div className="main-ranking-match">
              <ul>
                {['1월22일', '1월23일', '1월24일'].map((date, index) => (
                  <li className="main-rank-match" key={index}>
                    <button onClick={handleModal} className={`main-rank-match-btn ${index}`}>
                      <span>{date}</span>
                      <span>11VS11</span>
                      <span>시흥 서울대학교 스포츠 파크</span>
                      <span>시흥 서울대학교 스포츠 파크(풋살) 11VS11</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="main-matchlist">
            <ul>
              {['운동', '운동', '운동', '운동', '운동'].map((category, index) => (
                <li className={`main-matchlist-els ${index}`} key={index}>
                  <ul>
                    <li className="main-matchlist-el-bg">
                      <span className="main-matchlist-tag">{category}</span>
                    </li>
                  </ul>
                  <div className="main-matchlist-el">
                    <a className="main-matchlist-el-link">
                      <div className="main-matchlist-el-tit">
                        <span>한강에서 1시간 러닝하실 분</span>
                      </div>
                      <div className="main-matchlist-el-info">
                        <span>한강둔치</span>
                        <span>5명</span>
                        <span>1/23</span>
                      </div>
                      <img src={searchIcon} alt="돋보기" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div id="Accordion_wrap" className={activeAccordion === 1 ? 'caldendar' : ""}>
            {/* Accordion */}
            {['채팅', '달력', '1:1 문의'].map((item, index) => (
              <div key={index}>
                <div className={`que ${activeAccordion === index ? 'on' : ''}`} onClick={() => handleAccordionClick(index)}>
                  <img
                    src={index === 0 ? chatIcon : index === 1 ? calendarIcon : callIcon} alt="아이콘" />
                  <span>{item}</span>
                </div>
                {item === "채팅" &&
                  <div className="anw" style={{ height: activeAccordion === index ? '40px' : '0px'}}>
                    <div>채팅 연결</div>
                  </div>}
                {item === "달력" &&
                  <div className="anw" style={{ width:'500px',height: activeAccordion === index ? '530px' : '0px'}}>
                    <UserCalendar />
                  </div>}
                {item === "1:1 문의" &&
                  <div className="anw" style={{ height: activeAccordion === index ? '40px' : '0px'}}>
                    <div>챗봇 연결</div>
                  </div>}
              </div>
            ))}
          </div>
        </section>
      </main>
      {selectMatch != null && <MatchModal selectMatch={selectMatch} setMatchList={setMatchList} />}
    </>
  );
};
export default Main;