
import "../../css/matching_css/matchingList.css";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import MatchModal from "./matchModal";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


const MatchList = () => {

    const [selectMatch, setMatchList] = useState(null);

    const handleModal = (e) => {
        setMatchList(e.target.classList[1]);
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
                <button className="match-reg-btn" href="#">매칭 등록</button>
                {[24, 25, 26].map((day, i) => (
                    <div className="match-continer" key={day}>
                        <div className="match-day">
                            <p>2/</p>
                            <span>{day}</span>
                            <p>{["수요일", "목요일", "금요일"][day - 24]}</p>
                        </div>
                        <div className="match-blue-line"></div>
                        <div className="match-data">
                            <ul>
                                {Array.from({ length: 4 }).map((_, j) => (
                                    <li key={j}>
                                        <div className="match-time">19:00</div>
                                        <div className="match-content">
                                            시흥 서울대학교 스포츠파크(풋살) 11vs11
                                        </div>
                                        <div className="match-sub-info">
                                            <p>운동</p>
                                            <p>남녀모두</p>
                                            <p>11vs11</p>
                                            <p>일반</p>
                                        </div>
                                        <div className="match-info-btn">
                                            <button
                                                className={["no "+((j+1)+4*i), "ok "+((j+1)+4*i), "end "+((j+1)+4*i)][(j % 3)]}
                                                onClick={handleModal}
                                            >
                                                {i % 3 === 1
                                                    ? "신청 가능"
                                                    : i % 3 === 2
                                                        ? "마감 임박"
                                                        : "모집 완료"}
                                            </button>
                                        </div>
                                        <div className="match-line"></div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            {selectMatch != null && <MatchModal selectMatch={selectMatch} setMatchList={setMatchList} />}
        </div>
    );
}
export default MatchList;