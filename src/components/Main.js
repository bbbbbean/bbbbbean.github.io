import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";

import "../css/common_css/main_main.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import searchIcon from "../image/image_main/serch-icon.svg";
import MatchModal from "./match/matchModal";
import AccordionModal from "./modal/AccordionModal";
import api from "../axios";
import swiperimage1 from "../image/image_swiper/1.jpg";
import swiperimage2 from "../image/image_swiper/2.jpg";
import swiperimage4 from "../image/image_swiper/4.jpg";
import swiperimage3 from "../image/image_swiper/3.jpg";
import swiperimage5 from "../image/image_swiper/5.jpg";
import swiperimage6 from "../image/image_swiper/6.jpg";
import swiperimage7 from "../image/image_swiper/7.jpg";

import categoryimage1 from "../image/image_match_category/운동.png";
import categoryimage2 from "../image/image_match_category/여행.jpg";
import categoryimage3 from "../image/image_match_category/게임.jpg";
import categoryimage4 from "../image/image_match_category/기타.jpg";
const Main = () => {
  const [isAuth] = useState(localStorage.getItem("isAuth"));

  useEffect(() => {
    const mainMatchlistEls = document.querySelectorAll(".main-matchlist-els");

    mainMatchlistEls.forEach((item) => {
      item.addEventListener("click", handleModal);
    });
  }, []);

  // 모달 상태 관리
  const [selectMatch, setSelectMatch] = useState(null);

  const handleModal = (e) => {
    setSelectMatch(parseInt(e.target.classList[1], 10));
  };

  selectMatch != null
    ? document.body.classList.add("stop-scrolling")
    : document.body.classList.remove("stop-scrolling");

  //검색 코드
  const [matchFindValue, setMatchFindValue] = useState("");
  // const matchFind = () => {
  //   console.log("검색어:", matchFindValue);
  //   api.post("/api/main/findMatch", { keyword: matchFindValue })
  //     .then((response) => {
  //       console.log(response.data.matches);
  //       setNewMatchList(response.data.matches);
  //     })
  //     .catch((error) => {
  //       console.error("검색 실패:", error.response?.data || error.message);
  //       setNewMatchList([]);
  //     });
  // };

  //검색 후 페이지 이동
  const navigate = useNavigate();
  const handleSearch = async () => {
    if (matchFindValue.trim()) {
      try {
        const response = await api.post("/api/main/findMatch", {
          keyword: matchFindValue.trim(),
        });
        console.log("검색 결과:", response.data.matches);
        const matches = response.data.matches;

        if (matches.length === 0) {
          alert("검색 결과가 없습니다.");
        } else {
          navigate(`/match/list/all?keyword=${matchFindValue.trim()}`);
        }
      } catch (error) {
        console.error("검색 오류:", error);
        alert("검색 중 오류가 발생했습니다.");
      }
    }
  };

  const [tags, setTags] = useState([]);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await api.get("/api/main/popular");
        setTags(res.data);
      } catch (err) {
        console.error(
          "인기 태그 불러오기 실패",
          err.response?.data || err.message
        );
      }
    }

    fetchTags();
  }, []);

  const categoryMap = {
    1: "운동",
    2: "여행",
    3: "게임",
    4: "기타",
  };

  const [randomMatchList, setRandomMatchList] = useState([]);
  useEffect(() => {
    async function fetchRandomMatchList() {
      try {
        // 예: GET 방식, 랜덤 매칭 리스트를 받는 API 엔드포인트
        const res = await api.post("/api/main/random");
        setRandomMatchList(res.data.random); // matches 배열로 받는다고 가정
      } catch (err) {
        console.error(
          "랜덤 매칭 리스트 불러오기 실패",
          err.response?.data || err.message
        );
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
        console.error(
          "매치 리스트 불러오기 실패",
          err.response?.data || err.message
        );
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
              <SwiperSlide>
                <img src={swiperimage1} alt="Slide 1" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={swiperimage2} alt="Slide 2" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={swiperimage3} alt="Slide 3" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={swiperimage4} alt="Slide 4" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={swiperimage5} alt="Slide 5" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={swiperimage6} alt="Slide 6" />
              </SwiperSlide>
              <SwiperSlide>
                <img src={swiperimage7} alt="Slide 7" />
              </SwiperSlide>
            </Swiper>
          </div>

          <div className="main-wording-section">
            <div className="main-wording">
              <span>
                <p className="semibold">딱</p>맞는 사람들과{" "}
                <p className="bold">MATCH!</p>
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
            <span>
              지금 나만의 <p className="semibold">MATCH</p>를 찾는다면?
            </span>
            {/* 검색창 */}
            <ul className="serch-bar">
              <li className="main-search-input">
                {/* 글자수 제한 */}
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={matchFindValue}
                  onChange={(e) => {
                    setMatchFindValue(e.target.value);
                  }}
                />
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
                {Array.isArray(tags) &&
                  tags.map((item, index) => (
                    <li className="main-rank-el" key={index}>
                      <ul>
                        <li className="main-rank-el-num">{index + 1}</li>
                        <li className="main-rank-el-con">{item.tag}</li>
                        <li className="main-rank-el-go"></li>
                      </ul>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="main-ranking-match">
              <ul>
                {Array.isArray(randomMatchList) &&
                  randomMatchList.map((data, index) => (
                    <li
                      className="main-rank-match"
                      key={index}
                      style={{
                        backgroundImage:
                          data.kategorie === 1
                            ? `url(${categoryimage1})`
                            : data.kategorie === 2
                            ? `url(${categoryimage2})`
                            : data.kategorie === 3
                            ? `url(${categoryimage3})`
                            : `url(${categoryimage4})`,
                      }}
                    >
                      <button
                        onClick={handleModal}
                        className={`main-rank-match-btn ${data.matchId}`}
                      >
                        <div className="category">
                          <div className="catename">
                            {categoryMap[data.kategorie] || "기타"}
                          </div>
                        </div>
                        <div>
                          {(() => {
                            const date = new Date(data.startTime);
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const day = String(date.getDate()).padStart(2, "0");
                            return `${month}월${day}일`;
                          })()}
                        </div>
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
                <li
                  onClick={handleModal}
                  className={`main-matchlist-els ${match.matchId}`}
                  key={match.id || index}
                >
                  <ul>
                    <li
                      className="main-matchlist-el-bg"
                      style={{
                        backgroundImage: `url(${
                          match.kategorie === 1
                            ? categoryimage1
                            : match.kategorie === 2
                            ? categoryimage2
                            : match.kategorie === 3
                            ? categoryimage3
                            : categoryimage4
                        })`,
                        backgroundSize: "cover", // 배경 이미지 크기 조정
                        backgroundPosition: "center", // 이미지를 중앙에 배치
                      }}
                    >
                      <span className="main-matchlist-tag">
                        {categoryMap[match.kategorie] || "기타"}
                      </span>
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
                        <span>
                          {(() => {
                            const date = new Date(match.startTime);
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            );
                            const day = String(date.getDate()).padStart(2, "0");
                            const hour = String(date.getHours()).padStart(
                              2,
                              "0"
                            );
                            const minute = String(date.getMinutes()).padStart(
                              2,
                              "0"
                            );
                            return `${month}월${day}일 ${hour}시${minute}분`;
                          })()}
                        </span>
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
      {selectMatch != null && (
        <MatchModal selectMatch={selectMatch} setSelectMatch={setSelectMatch} />
      )}
    </>
  );
};
export default Main;
