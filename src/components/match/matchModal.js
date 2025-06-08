import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import api from "../../axios"
import "../../css/matching_css/matchModalContent.css";

const MatchModal = ({ selectMatch, setMatchList }) => {
    const { matchId } = useParams();

    const location = useLocation();
    const match = location.state?.match;

    console.log("match", match);

    // 상태 정보들
    match.anonymousCondi = match.anonymousCondi == 0 ? "익명" : "실명";

    if (match.genderCondi === "0") {
        if (match.gender === "female") {
            match.genderCondi = "여성만";
        } else {
            match.genderCondi = "남성만";
        }
    } else {
        match.genderCondi = "남녀 모두";
    }

    // 날짜
    const formatDateInfo = (startTimeStr) => {
        console.log(startTimeStr);
        const date = new Date(startTimeStr);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
        return { month, day, weekday };
    };
    const { month, day, weekday } = formatDateInfo(match.startTime);


    console.log("Select : " + selectMatch);
    useEffect(() => {
        const matchModal = document.querySelector(".match-modal");
        const matchChatContent = document.querySelector(".match-chat-content");
        const matchModalBtn = document.querySelector(".match-modal-btn");
        const matchChatLock = document.querySelector(".match-chat-lock");

        matchModalBtn.addEventListener("click", (e) => {
            // eslint-disable-next-line no-restricted-globals
            if (confirm("신청 하시겠습니까?")) {
                matchChatLock.style.display = "none";
            }
        });

        matchChatContent.addEventListener("wheel", (e) => {
            e.preventDefault();
            matchChatContent.scrollTop += e.deltaY / 5;
        });

        let modalOut = true;
        matchModal.addEventListener("mouseenter", (e) => {
            modalOut = !modalOut;
        });
        matchModal.addEventListener("mouseleave", (e) => {
            modalOut = !modalOut;
        });

        const matchModalContainer = document.querySelector(
            ".match-modal-container"
        );
        matchModalContainer.addEventListener("click", (e) => {
            if (modalOut) setMatchList(null);
        });

        window.document.addEventListener("keydown", (e) => {
            if (e.keyCode === 27) setMatchList(null);
        });

    }, [setMatchList]);
    return (
        <div className="match-modal-container">
            <div className="match-modal">
                <div className="match-left">
                    <div className="match-modal-img"></div>
                    <div className="match-modal-title">
                        <p>{match.title}</p>
                    </div>
                    <div className="modal-blue-line"></div>
                    <div className="match-modal-info">
                        <div className="match-modal-info-left">
                            <div className="match-symbol-container">
                                {["Check", "Groups", "Wc"].map((icon, i) => (
                                    <div className="match-symbol" key={i}>
                                        <span className="material-symbols-outlined">{icon}</span>
                                        <p>{[match.people + "명", match.anonymousCondi, match.genderCondi][i]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="match-modal-info-right">
                            <div className="match-info-tag">
                                <span>운동</span>
                            </div>
                            <div className="match-info-content">
                                <p>{month}월 {day}일 {weekday}요일</p>
                                <p>{match.time}</p>
                                <p>{match.location}</p>
                                <a href="#">지도로 확인하기</a>
                            </div>
                            <div className="match-info-user">
                                <button>{match.nickName}</button>
                            </div>
                            <div className="match-modal-btn">
                                <button>신청하기</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="match-right">
                    <div className="match-chat-lock">
                        <span className="material-symbols-outlined">Lock</span>
                        <p>매칭 신청하고 채팅 참가하기</p>
                    </div>
                    <div className="match-chat-container">
                        <div className="match-chat-title">
                            <div className="match-chat-img">
                                <img
                                    src="https://t1.daumcdn.net/friends/prod/editor/dc8b3d02-a15a-4afa-a88b-989cf2a50476.jpg"
                                    alt="기본이미지"
                                />
                            </div>
                            <div className="match-chat-name">
                                <p>호스트 닉네임(기본)</p>
                                <span className="material-symbols-outlined">Person</span>
                                <span>8</span>
                            </div>
                        </div>
                        <div className="match-chat-line"></div>
                        <div className="match-chat-content">
                            <div className="user-chat-container">
                                <img className="prf-image" src="" alt="prf-i" />
                                <div className="user-chat">
                                    <div className="user-name">닉네임1</div>
                                    <div className="user-content">경기도 시흥시 서울대학교에서 1월 22일 풋살경기합니다.</div>
                                    <div className="user-chat-time">오후7:39</div>
                                </div>
                            </div>
                            <div className="user-chat-container">
                                <img className="prf-image" src="" alt="prf-i" />
                                <div className="user-chat">
                                    <div className="user-name">닉네임2</div>
                                    <div className="user-content">네</div>
                                    <div className="user-chat-time">오후7:40</div>
                                </div>
                            </div>
                            <div className="your-chat-container">
                                <div className="user-chat">
                                    <div className="your-content">시흥 서울대학교 스포츠파크</div>
                                    <div className="your-chat-time">오후7:40</div>
                                </div>
                            </div>
                            <div className="your-chat-container">
                                <div className="user-chat">
                                    <div className="your-content">채팅창위에 마우스를 놓고 마우스 휠을 움직여보세요</div>
                                    <div className="your-chat-time">오후7:40</div>
                                </div>
                            </div>
                            <div className="your-chat-container">
                                <div className="user-chat">
                                    <div className="your-content">
                                        나의 말풍선......나의 말풍선......나의 말풍선......나의 말풍선......나의 말풍선......
                                    </div>
                                    <div className="your-chat-time">오후7:40</div>
                                </div>
                            </div>
                        </div>
                        <div className="match-chat-input">
                            <input type="text" />
                            <button>
                                <span className="material-symbols-outlined">Send</span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
};

export default MatchModal;