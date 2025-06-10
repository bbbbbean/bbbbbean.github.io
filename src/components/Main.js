import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";

import "../css/common_css/main_main.css";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import searchIcon from "../image/image_main/serch-icon.svg";
import MatchModal from "./match/matchModal";
import AccordionModal from "./modal/AccordionModal";
import api from "../axios";

const Main = () => {

  const [isAuth] = useState(localStorage.getItem("isAuth"));

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

  //검색 코드
  const [matchFindValue, setMatchFindValue] = useState("");
  const matchFind = () => {
    console.log("검색어:", matchFindValue);
    api.post("/api/main/findMatch", { keyword: matchFindValue })
      .then((response) => {
        console.log(response.data.matches);
        setNewMatchList(response.data.matches);
      })
      .catch((error) => {
        console.error("검색 실패:", error.response?.data || error.message);
        setNewMatchList([]); 
      });
  };

  //검색 후 페이지 이동
  const navigate = useNavigate();
  const handleSearch = () => {
    if (matchFindValue.trim()) {
       navigate(`/match/list/all?keyword=${encodeURIComponent(matchFindValue)}`);
    }
  };


  const [tags, setTags] = useState([]);

useEffect(() => {
  async function fetchTags() {
    try {
      const res = await api.get("/api/main/popular");
      setTags(res.data);
    } catch (err) {
      console.error("인기 태그 불러오기 실패", err.response?.data || err.message);
    }
  }

  fetchTags();
}, []);

const categoryMap = {
  "1": "운동",
  "2": "여행",
  "3": "게임",
  "4": "기타"
};

const [randomMatchList, setRandomMatchList] = useState([]);
useEffect(() => {
  async function fetchRandomMatchList() {
    try {
      // 예: GET 방식, 랜덤 매칭 리스트를 받는 API 엔드포인트
      const res = await api.post("/api/main/random");
      setRandomMatchList(res.data.random); // matches 배열로 받는다고 가정
    } catch (err) {
      console.error("랜덤 매칭 리스트 불러오기 실패", err.response?.data || err.message);
    }
  }

  fetchRandomMatchList();
}, []);

  // DB에서 불러온 리스트 상태 관리
 const [matchList, setNewMatchList] = useState([]);
  useEffect(() => {
    async function fetchMatchList() {
      try {
        const res = await api.post("/api/main/matches"); // 예시 엔드포인트
        setNewMatchList(res.data.matches);
      } catch (err) {
        console.error("매치 리스트 불러오기 실패", err.response?.data || err.message);
      }
    }
    fetchMatchList();
  }, []);

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
                <input type="text" placeholder="검색어를 입력하세요" value={matchFindValue} onChange={(e) => {
                  setMatchFindValue(e.target.value);
                }} />
              </li>
              <li className="main-search-btn">
                <button onClick={handleSearch}>
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
                {Array.isArray(tags) && tags.map((item, index) => (
                  <li className="main-rank-el" key={index}>
                    <ul>
                      <li className="main-rank-el-num">{index + 1}</li>
                      <li className="main-rank-el-con">{item.tag}</li>
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
                {Array.isArray(randomMatchList) && randomMatchList.map((data, index) => (
                  <li className="main-rank-match" key={index}>
                    <button onClick={handleModal} className={`main-rank-match-btn ${index}`}>
                      <div className="category">
                        <div className="catename">{categoryMap[data.kategorie] || "기타"}</div>
                      </div>
                      <div>{(() => {
                        const date = new Date(data.startTime);
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        return `${month}월${day}일`;
                      })()}</div>
                      <div>{data.people}명 모집</div>
                      <div>{data.location}</div>
                      <div>{data.title}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="main-matchlist">
            <ul>
              {matchList.map((match, index) => (
                <li className={`main-matchlist-els ${index}`} key={match.id || index}>
                  <ul>
                    <li className="main-matchlist-el-bg">
                      <span className="main-matchlist-tag">{categoryMap[match.kategorie] || "기타"}</span>
                    </li>
                  </ul>
                  <div className="main-matchlist-el">
                    <a className="main-matchlist-el-link">
                      <div className="main-matchlist-el-tit">
                        <span>{match.title}</span>
                      </div>
                      <div className="main-matchlist-el-info">
                        <span>{match.location}</span>
                        <span>{match.people}명</span>
                        <span>{(() => {
                          const date = new Date(match.startTime);
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const day = String(date.getDate()).padStart(2, '0');
                          const hour = String(date.getHours()).padStart(2, '0');
                          const minute = String(date.getMinutes()).padStart(2, '0');
                          return `${month}월${day}일 ${hour}시${minute}분`;
                        })()}</span>
                      </div>
                      <img src={searchIcon} alt="돋보기" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* {isAuth && <AccordionModal />} */}
        </section>
      </main>
      {selectMatch != null && <MatchModal selectMatch={selectMatch} setMatchList={setMatchList} />}
    </>
  );
};
export default Main;