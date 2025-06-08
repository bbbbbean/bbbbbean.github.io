
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

    const [selectMatch, setMatchList] = useState(null);
    const [matches, setMatches] = useState([]);
    const [bookmark, setBookmark] = useState({});

    const handleModal = (e) => {
        setMatchList(e.target.classList[1]);
    }
    const navigate = useNavigate();


    // 전체 조회해서 데이터 들고오기
    useEffect(() => {
        api.get("/match/list")
            .then(res => {
                setMatches(res.data);
                console.log(res.data)

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
        await api.post("/match/bookmark", { matchId, userId, isBookmark: nextState });
        console.log(matchId, userId);
        setBookmark(prev => ({
            ...prev,
            [matchId]: nextState
        }));
    };

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
                        centeredSlides={true}
                        slidesOffsetBefore={10}
                        loop={true}
                        breakpoints={
                            {
                                0: {
                                    slidesPerView: 2,
                                },
                                768: {
                                    slidesPerView: 3,
                                },
                                1024: {
                                    slidesPerView: 4,
                                },
                                1280: {
                                    slidesPerView: 5,
                                },
                            }
                        }
                        autoplay={{
                            delay: 2500,
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
                            <div className="promotion-swiper">
                                <div className="swiper-wrapper">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div className="swiper-slide" key={i}>
                                            <div className="promotion-match">
                                                <div className="pm-match-container">
                                                    <p>1월22일</p>
                                                    <span>운동</span>
                                                </div>
                                                <div className="pm-match-title">
                                                    <p>5VS5</p>
                                                    <p>온라인</p>
                                                    <span>발로란트 내전 5vs5 너만오면 고</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="promotion-swiper">
                                <div className="swiper-wrapper">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div className="swiper-slide" key={i}>
                                            <div className="promotion-match">
                                                <div className="pm-match-container">
                                                    <p>1월22일</p>
                                                    <span>운동</span>
                                                </div>
                                                <div className="pm-match-title">
                                                    <p>5VS5</p>
                                                    <p>온라인</p>
                                                    <span>발로란트 내전 5vs5 너만오면 고</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="promotion-swiper">
                                <div className="swiper-wrapper">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div className="swiper-slide" key={i}>
                                            <div className="promotion-match">
                                                <div className="pm-match-container">
                                                    <p>1월22일</p>
                                                    <span>운동</span>
                                                </div>
                                                <div className="pm-match-title">
                                                    <p>5VS5</p>
                                                    <p>온라인</p>
                                                    <span>발로란트 내전 5vs5 너만오면 고</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="promotion-swiper">
                                <div className="swiper-wrapper">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div className="swiper-slide" key={i}>
                                            <div className="promotion-match">
                                                <div className="pm-match-container">
                                                    <p>1월22일</p>
                                                    <span>운동</span>
                                                </div>
                                                <div className="pm-match-title">
                                                    <p>5VS5</p>
                                                    <p>온라인</p>
                                                    <span>발로란트 내전 5vs5 너만오면 고</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="promotion-swiper">
                                <div className="swiper-wrapper">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div className="swiper-slide" key={i}>
                                            <div className="promotion-match">
                                                <div className="pm-match-container">
                                                    <p>1월22일</p>
                                                    <span>운동</span>
                                                </div>
                                                <div className="pm-match-title">
                                                    <p>5VS5</p>
                                                    <p>온라인</p>
                                                    <span>발로란트 내전 5vs5 너만오면 고</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="promotion-swiper">
                                <div className="swiper-wrapper">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div className="swiper-slide" key={i}>
                                            <div className="promotion-match">
                                                <div className="pm-match-container">
                                                    <p>1월22일</p>
                                                    <span>운동</span>
                                                </div>
                                                <div className="pm-match-title">
                                                    <p>5VS5</p>
                                                    <p>온라인</p>
                                                    <span>발로란트 내전 5vs5 너만오면 고</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="promotion-swiper">
                                <div className="swiper-wrapper">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div className="swiper-slide" key={i}>
                                            <div className="promotion-match">
                                                <div className="pm-match-container">
                                                    <p>1월22일</p>
                                                    <span>운동</span>
                                                </div>
                                                <div className="pm-match-title">
                                                    <p>5VS5</p>
                                                    <p>온라인</p>
                                                    <span>발로란트 내전 5vs5 너만오면 고</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="promotion-swiper">
                                <div className="swiper-wrapper">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div className="swiper-slide" key={i}>
                                            <div className="promotion-match">
                                                <div className="pm-match-container">
                                                    <p>1월22일</p>
                                                    <span>운동</span>
                                                </div>
                                                <div className="pm-match-title">
                                                    <p>5VS5</p>
                                                    <p>온라인</p>
                                                    <span>발로란트 내전 5vs5 너만오면 고</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SwiperSlide>
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
                                                        onClick={handleModal}
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