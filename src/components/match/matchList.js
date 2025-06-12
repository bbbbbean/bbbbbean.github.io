import "../../css/matching_css/matchingList.css";
import mark1 from "../../image/image_match/bookmark_border.svg";
import mark2 from "../../image/image_match/bookmark.svg";
import nomatch from "../../image/image_match/matchlist.svg";

import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import MatchModal from "./matchModal";
import api from "../../axios";
import newMatch from "./newMatch";

import categoryimage1 from "../../image/image_match_category/운동.png";
import categoryimage2 from "../../image/image_match_category/여행.jpg";
import categoryimage3 from "../../image/image_match_category/게임.jpg";
import categoryimage4 from "../../image/image_match_category/기타.jpg";

//검색 결과용
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const MatchList = () => {
  const navigate = useNavigate();
  const { type } = useParams();

  const [selectMatch, setSelectMatch] = useState(null);
  const [topMatches, setTopMatches] = useState([]);
  const [matches, setMatches] = useState([]);
  const [bookmark, setBookmark] = useState({});
  const [matchOne, setMatchOne] = useState({});
  const [reload, setReload] = useState(false);

  const isAuth = localStorage.getItem("isAuth");

  console.log("type", type);

  //검색 결과용
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  // 전체 조회해서 데이터 들고오기 + 닉네임, 젠더 추가
  useEffect(() => {
    console.log("키워드" + keyword);

    api
      .post(`/match/list`, { type, keyword })
      .then(async (res) => {
        // match 전체 데이터
        const matches = res.data;

        console.log("else 매치", matches);

        const fullMatch = matches.map((match, i) => ({
          ...match,
        }));

        setMatches(fullMatch);
        console.log("setMatches" + setMatches);

        // 최근 등록 매치 5개
        const sortedTop5 = fullMatch
          .sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
          .slice(0, 5);

        setTopMatches(sortedTop5);
      })
      .catch((err) => {});
  }, [type, reload]);

  // 북마크 조회해서 기본 적용
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    api.get(`/match/bookmark/list?userId=${userId}`).then((res) => {
      const map = {};
      res.data.forEach((matchId) => {
        map[matchId] = true;
      });
      setBookmark(map);
    });
  }, []);

  // 날짜
  const formatDateInfo = (startTimeStr) => {
    console.log("formatDateInfo 호출:", startTimeStr);
    if (!startTimeStr) {
      console.warn("startTime이 없어요:", startTimeStr);
      return {
        month: "-",
        day: "-",
        weekday: "-",
      };
    }

    console.log(startTimeStr);
    const date = new Date(startTimeStr.replace(" ", "T"));
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return { month, day, weekday };
  };

  // 같은 날짜별로 그룹 묶기
  const groupByDay = (matchList) => {
    console.log("groupByDay matchList: ", matchList);
    console.log("Type of matchList: ", typeof matchList);

    const grouped = {};
    matchList.forEach((match) => {
      const { month, day, dateObj } = formatDateInfo(match.startTime);
      const dayKey = `${month}/${day}`;

      const timeForm = new Date(match.startTime.replace(" ", "T"));
      const hours = timeForm.getHours().toString().padStart(2, "0");
      const minutes = timeForm.getMinutes().toString().padStart(2, "0");
      const time = `${hours}:${minutes}`;

      if (!grouped[dayKey]) grouped[dayKey] = [];
      grouped[dayKey].push({ ...match, dateObj, time });
    });

    // 정렬
    for (const dayKey in grouped) {
      grouped[dayKey].sort((a, b) => a.dateObj - b.dateObj);
    }

    return grouped;
  };

  const sortedGroupList = Object.entries(groupByDay(matches)).sort(
    ([dayKeyA, arrA], [dayKeyB, arrB]) => {
      const dateA = new Date(arrA[0].startTime.replace(" ", "T"));
      const dateB = new Date(arrB[0].startTime.replace(" ", "T"));
      return dateA - dateB;
    }
  );

  // 북마크
  const handleBookmarkClick = async (matchId) => {
    const userId = localStorage.getItem("userId");
    const nextState = !bookmark[matchId];
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }
    const CurrentBookmark = bookmark[matchId];
    const url = CurrentBookmark
      ? "/match/bookmark/remove"
      : "/match/bookmark/add";

    try {
      await api.post(url, {
        matchId,
        userId,
      });

      console.log("Bookmark 요청:", matchId, userId, url);

      setBookmark((prev) => ({
        ...prev,
        [matchId]: !prev[matchId],
      }));
    } catch (err) {
      console.error("북마크 요청 실패:", err);
    }
  };

  // 슬라이드 날짜 포멧팅팅
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };
  // 카테고리
  const kategorieName = (kategorie) => {
    if (kategorie == 1) {
      kategorie = "운동";
    } else if (kategorie == 2) {
      kategorie = "여행";
    } else if (kategorie == 3) {
      kategorie = "게임";
    } else if (kategorie == 4) {
      kategorie = "기타";
    }
    return kategorie;
  };

  selectMatch != null
    ? document.body.classList.add("stop-scrolling")
    : document.body.classList.remove("stop-scrolling");

  // top 헤더
  const topHeader = (type) => {
    if (type === "1") {
      return (
        <div className="match-titlebar">
          운동
          <p>EXERCISE</p>
        </div>
      );
    } else if (type === "2") {
      return (
        <div className="match-titlebar">
          여행
          <p>TRIP</p>
        </div>
      );
    } else if (type === "3") {
      return (
        <div className="match-titlebar">
          게임
          <p>GAME</p>
        </div>
      );
    } else if (type === "4") {
      return (
        <div className="match-titlebar">
          기타
          <p>ETC</p>
        </div>
      );
    } else if (type === "all") {
      return (
        <div className="match-titlebar">
          전체매칭
          <p>ALL</p>
        </div>
      );
    }
  };

  // useEffect(() => {
  //   const fetchMatches = async () => {
  //     try {
  //       if (keyword) {
  //         const res = await api.post("/api/main/findMatch", { keyword });
  //         setMatches(res.data.matches || []);
  //       } else {
  //         const res = await api.get(`/match/list?type=${type}`);
  //         setMatches(res.data || []);
  //       }
  //     } catch (err) {
  //       console.error(
  //         "매칭 데이터 가져오기 실패:",
  //         err.response?.data || err.message
  //       );
  //     }
  //   };

  //   fetchMatches();
  // }, [keyword, type, reload]);

  const nullMatch =
    matches.length === 0 ? (
      <div className="match-list-no-matches">
        <img src={nomatch} />
        <p className="match-list-no-word">매칭이 없습니다</p>
        <p className="match-list-no-word-l">매칭을 등록해보세요</p>
      </div>
    ) : (
      ""
    );

  return (
    <div className="match-page">
      {topHeader(type)}
      <div className="pm-center">
        {/* Swiper component */}
        {topMatches.length > 4 && (
          <Swiper
            slidesPerView={4}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Autoplay, Navigation]}
            className="mySwiper"
          >
            {topMatches.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className="promotion-match"
                  onClick={() => {
                    setMatchOne(item);
                    setSelectMatch(item.matchId);
                  }}
                  style={{
                    backgroundImage: `url(${
                      item.kategorie === 1
                        ? categoryimage1
                        : item.kategorie === 2
                        ? categoryimage2
                        : item.kategorie === 3
                        ? categoryimage3
                        : categoryimage4
                    })`,
                    backgroundSize: "cover", // 배경 이미지 크기 조정
                    backgroundPosition: "center", // 이미지를 중앙에 배치
                  }}
                >
                  <div className="pm-match-container">
                    <p>{formatDate(item.startTime)}</p>
                    <span>{kategorieName(item.kategorie)}</span>
                  </div>
                  <div className="pm-match-title">
                    {item.tags.map((tag, i) => (
                      <p key={i}>#{tag} </p>
                    ))}
                    <span>{item.title}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <div className="match-list">
        <button
          className="match-reg-btn"
          onClick={() =>
            isAuth ? navigate("/match/newMatch") : navigate("/user/login")
          }
        >
          매칭 등록
        </button>
        <div className="match-list-no-wrap">{nullMatch}</div>
        {sortedGroupList.map(([dayKey, matchArray]) => {
          const [month, day] = dayKey.split("/");
          const weekday = ["일", "월", "화", "수", "목", "금", "토"][
            new Date(matchArray[0].startTime).getDay()
          ];
          return (
            <div className="match-continer" key={dayKey}>
              {/* 같은 월,요일 */}
              <div className="match-day">
                <p>{month}/</p>
                <span>{day}</span>
                <p>{weekday}요일</p>
              </div>
              <div className="match-blue-line"></div>
              {matchArray.map((match, idx) => (
                <>
                  <div className="match-data">
                    <ul>
                      <li>
                        <div className="match-book-mark">
                          <img
                            src={bookmark[match.matchId] ? mark2 : mark1}
                            onClick={() => handleBookmarkClick(match.matchId)}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                        <div className="match-time">{match.time}</div>
                        <div className="match-content">{match.title}</div>
                        <div className="match-sub-info">
                          {match.tags.map((tag, i) => (
                            <p key={i}>#{tag} </p>
                          ))}
                        </div>
                        <div className="match-info-btn">
                          <button
                            className={
                              match.status === 0 &&
                              match.countPeople < match.people
                                ? "ok"
                                : "no"
                            }
                            onClick={() => {
                              setSelectMatch(match.matchId);
                            }}
                          >
                            {/* 0:신청 가능 1: 모집완료 */}
                            {match.status === 0 &&
                            match.countPeople < match.people
                              ? "신청 가능"
                              : "모집 완료"}
                          </button>
                        </div>
                        <div className="match-line"></div>
                      </li>
                    </ul>
                  </div>
                </>
              ))}
            </div>
          );
        })}
      </div>
      {selectMatch != null && (
        <MatchModal
          selectMatch={selectMatch}
          setSelectMatch={setSelectMatch}
          setReload={setReload}
        />
      )}
    </div>
  );
};
export default MatchList;
