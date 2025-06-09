import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import api from "../../axios";
import "../../css/matching_css/matchModalContent.css";
import mark2 from "../../image/image_match/bookmark.svg";


const MatchModal = ({ selectMatch, setMatchList, match }) => {
  const { matchId } = useParams();
  const chatCode = match?.chatCode ?? null;
  const oneMatchId = match.matchId;

  const location = useLocation();

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

  console.log("Select : " + selectMatch);
  useEffect(() => {
    const matchModal = document.querySelector(".match-modal");
    const matchChatContent = document.querySelector(".match-chat-content");
    const matchModalBtn = document.querySelector(".match-modal-btn-el");
    //const matchChatLock = document.querySelector(".match-chat-lock");

    matchModalBtn.addEventListener("click", (e) => {
      // eslint-disable-next-line no-restricted-globals
      if (confirm("신청 하시겠습니까?")) {
        console.log("dho"+oneMatchId, chatCode);
        api
          .post("/match/join", { "matchId":oneMatchId, chatCode })
          .then((res) => {
          })
          .catch((err) => {
            console.error("신청 실패:", err);
          });
      }
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
        <div className="match-modal-header">
          <div className="match-info-tag">
            <span>{kategorieName(match.kategorie)}</span>

            {match.isBookmarked && <span><img src={mark2}/></span>}

          </div>
          <div className="match-modal-title">
            <p>{match.title}</p>
          </div>
          <div className="match-info-user">
            <button>{match.nickName}</button>
          </div>
        </div>
        <div className="match-modal-info">
          <div className="match-info-content">
            <div className="match-info-tags">
              {match.tags.map((tag, i) => (
                <p key={i}>#{tag} </p>
              ))}
            </div>
            <p>
              {month}월 {day}일 {weekday}요일
            </p>
            <p>{match.time}</p>
            <p className="match-info-content-location">{match.location}</p>
            {match.location !== "온라인" && (
              <a
                href={`https://map.kakao.com/?search&q=${match.location}`}
                target="_blank"
              >
                지도로 확인하기
              </a>
            )}
          </div>
          <div className="match-modal-info-left">
            <div className="match-symbol-container">
              {["Check", "Groups", "Wc"].map((icon, i) => (
                <div className="match-symbol-el">
                  <div className="match-symbol" key={i}>
                    <span className="material-symbols-outlined">{icon}</span>
                  </div>
                  <p>
                    {
                      [
                        match.people + "명",
                        match.anonymousCondi,
                        match.genderCondi,
                      ][i]
                    }
                  </p>
                </div>
              ))}
            </div>
            <div className="match-modal-btn">
              <p>
                현재 참여 인원 <span>{match.countPeople}</span>/{match.people}
              </p>
              <button
                className={
                  match.status === 0 && match.countPeople < match.people
                    ? "match-modal-btn-el ok"
                    : "match-modal-btn-el no"
                }
                disabled={
                  !(match.status === 0 && match.countPeople < match.people)
                }
              >
                {match.status === 0 && match.countPeople < match.people
                  ? "신청하기"
                  : "모집 완료"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;
