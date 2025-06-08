
import "../../css/matching_css/matchingList.css";
import mark1 from "../../image/image_match/bookmark_border.svg"
import mark2 from "../../image/image_match/bookmark.svg"

import { useState } from "react";
import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import MatchModal from "./matchModal";
import api from "../../axios"
import newMatch from "./newMatch";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


const MatchList = () => {
    const navigate = useNavigate();

    const [selectMatch, setMatchList] = useState(null);
    const [topMatches, setTopMatches] = useState([]);
    const [matches, setMatches] = useState([]);
    const [bookmark, setBookmark] = useState({});


    // 전체 조회해서 데이터 들고오기 + 닉네임, 젠더 추가
    useEffect(() => {
        api.get("/match/list")
            .then(async res => {
                // match 전체 데이터
                const matches = res.data;

                // 필요한 호스트 유저 데이터
                const detailPromises = matches.map(match =>
                    api.get(`/match/detail?matchId=${match.matchId}`)
                        .then((res) => { return res.data })
                        .catch(() => null)
                );
                const userDetail = await Promise.all(detailPromises);

                // match + user
                const fullMatch = matches.map((match, i) => ({
                    ...match,
                    nickName: userDetail[i]?.[0]?.nickName,
                    gender: userDetail[i]?.[0]?.gender,
                    anonymousCondi:userDetail[i]?.[0]?.anonymousCondi,
                    genderCondi:userDetail[i]?.[0]?.genderCondi,
                    chatCode:userDetail[i]?.[0]?.chatCode,
                    location:userDetail[i]?.[0]?.location
                }));

                setMatches(fullMatch);
                console.log("setMatches" + setMatches);

                // 최근 등록 매치 5개
                const sortedTop5 = res.data
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 5);

                setTopMatches(sortedTop5);
            })
            .catch(err => { });
    }, []);

    // 북마크 조회해서 기본 적용
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        api.get(`/match/bookmark/list?userId=${userId}`)
            .then(res => {
                const map = {};
                res.data.forEach(matchId => {
                    map[matchId] = true;
                });
                setBookmark(map);
            });
    }, []);

    // 날짜
    const formatDateInfo = (startTimeStr) => {
        console.log(startTimeStr);
        const date = new Date(startTimeStr.replace(" ", "T"));
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
        return { month, day, weekday };
    };

    // 같은 날짜별로 그룹 묶기
    const groupByDay = (matchList) => {
        const grouped = {};
        matchList.forEach(match => {
            const { month, day, dateObj } = formatDateInfo(match.startTime);
            const dayKey = `${month}/${day}`;

            const timeForm = new Date(match.startTime.replace(" ", "T"));
            const hours = timeForm.getHours().toString().padStart(2, '0');
            const minutes = timeForm.getMinutes().toString().padStart(2, '0');
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

    const sortedGroupList = Object.entries(groupByDay(matches)).sort(([dayKeyA, arrA], [dayKeyB, arrB]) => {
        const dateA = new Date(arrA[0].startTime.replace(" ", "T"));
        const dateB = new Date(arrB[0].startTime.replace(" ", "T"));
        return dateA - dateB;
    });

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
                userId
            });

            console.log("Bookmark 요청:", matchId, userId, url);

            setBookmark(prev => ({
                ...prev,
                [matchId]: !prev[matchId]
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
    }

    selectMatch != null ? document.body.classList.add("stop-scrolling") : document.body.classList.remove("stop-scrolling");

    return (
        <div className="match-page">
            <div className="match-titlebar">
                전체매칭
                <p>ALL</p>
            </div>
            <div className="pm-center">
                {/* Swiper component */}
                <>
                    <Swiper
                        slidesPerView={4}
                        loop={true}
                        autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        pagination={{ clickable: true }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                    >
                        {topMatches.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="promotion-match">
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
                </>
            </div>

            <div className="match-list">
                {/* 로그인 여부에 따라 이동 변경 */}
                <button className="match-reg-btn" onClick={() => navigate('./newMatch')}>매칭 등록</button>
                {sortedGroupList.map(([dayKey, matchArray]) => {
                    const [month, day] = dayKey.split('/');
                    const weekday = ["일", "월", "화", "수", "목", "금", "토"][new Date(matchArray[0].startTime).getDay()];
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
                                                <div><img src={bookmark[match.matchId] ? mark2 : mark1} onClick={() => handleBookmarkClick(match.matchId)} style={{ cursor: "pointer" }} /></div>
                                                <div className="match-time">{match.time}</div>
                                                <div className="match-content">
                                                    {match.title}
                                                </div>
                                                <div className="match-sub-info">
                                                    {match.tags.map((tag, i) => (
                                                        <p key={i}>#{tag} </p>
                                                    ))}
                                                </div>
                                                <div className="match-info-btn">
                                                    <button
                                                        className={match.status === 0 && match.countPeople < match.people ? "ok" : "no"}
                                                        onClick={() => navigate(`/match/${match.matchId}`, { state: { match } })}
                                                    >
                                                        {/* 0:신청 가능 1: 모집완료 */}
                                                        {match.status === 0 && match.countPeople < match.people ? "신청 가능" : "모집 완료"}
                                                    </button>
                                                </div>
                                                <div className="match-line"></div>
                                            </li>

                                        </ul>
                                    </div>
                                </>
                            ))}
                        </div>
                    )
                })}
            </div>
            {selectMatch != null && <MatchModal selectMatch={selectMatch} setMatchList={setMatchList} />}
        </div>
    );
}
export default MatchList;