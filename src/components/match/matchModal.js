import { useEffect, useState, useContext } from "react";
import api from "../../axios";
import "../../css/matching_css/matchModalContent.css";
import mark2 from "../../image/image_match/bookmark.svg";
import { useNavigate } from "react-router-dom";
import { WebSocketContext } from "../../WebSocket";

const MatchModal = ({ selectMatch, setSelectMatch, setReload }) => {
  const { client, setUserInfomation } = useContext(WebSocketContext);
  const isAuth = localStorage.getItem("isAuth");

  const navigate = useNavigate();

  const [match, setMatch] = useState({
    anonymousCondi: "",
    chatCode: 0,
    genderCondi: "0",
    gender: "",
    kategorie: 1,
    isBookmarked: false,
    title: "",
    nickName: "",
    userId: "",
    tags: [],
    startTime: "",
    location: "",
    people: 0,
    countPeople: 0,
    status: 0,
    hosted: 0,
  });

  useEffect(() => {
    console.log("Fetching match data for ID:", selectMatch);
    api
      .post("/match/detail", { matchId: selectMatch })
      .then((response) => {
        console.log("Match data:", response.data);
        if (response.status === 200) {
          setMatch(response.data);
        } else {
          console.error("Failed to fetch match data");
        }
      })
      .catch((error) => {
        console.error("Error fetching match data:", error);
      });
  }, [selectMatch]);

  // 상태 정보들
  match.anonymousCondi = match.anonymousCondi == 0 ? "익명" : "실명";

  if (match.genderCondi === 0) {
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
      if (modalOut) setSelectMatch(null);
    });

    window.document.addEventListener("keydown", (e) => {
      if (e.keyCode === 27) setSelectMatch(null);
    });
  }, []);

  // 시간과 분만 추출하는 함수
  const formatTime = (startTimeStr) => {
    if (!startTimeStr) return "";
    const date = new Date(startTimeStr);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [showJoinConfirm, setShowJoinConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleJoin = () => {
    const chatCode = match.chatCode;
    api
      .post("/match/join", { matchId: selectMatch, chatCode })
      .then((response) => {
        if (response.status == 200) {
          client.publish({
            destination: "/pub/matchJoin",
            body: JSON.stringify({ matchId: selectMatch, ok: "join" }),
          });
          navigate(`/friend`, { state: { chatCode: match.chatCode } });
        } else {
          console.error("신청 실패:", response.data);
          alert("신청에 실패했습니다. 조건을 확인해주세요");
        }
      })
      .catch((err) => {
        console.error("신청 실패:", err);
      });
    setSelectMatch(null);
    setShowJoinConfirm(false);
  };

  const handleDelete = () => {
    if (match.hosted == 1) {

      client.publish({
        destination: "/pub/matchJoin",
        body: JSON.stringify({ matchId: selectMatch, ok: "del" }),
      });
      
      api
        .post("/match/delete", { matchId: selectMatch })
        .then((response) => {
          if (response.status === 200) {
            alert("매치가 삭제되었습니다.");
            setSelectMatch(null);
            setReload((prev) => !prev);

          } else {
            console.error("매치 삭제 실패:", response.data);
          }
        })
        .catch((error) => {
          console.error("매치 삭제 오류:", error);
        });
    } else {
      api
        .post("/match/cancel", { matchId: selectMatch })
        .then((response) => {
          if (response.status === 200) {
            alert("매치 참여를 취소했습니다.");
            setSelectMatch(null);
            setReload((prev) => !prev);
          } else {
            console.error("매치 참여 취소 실패:", response.data);
          }
        })
        .catch((error) => {
          console.error("매치 참여 취소 오류:", error);
        });
    }
    setShowDeleteConfirm(false);
  };

  return (
    <div className="match-modal-container">
      <div className="match-modal">
        <div className="match-modal-header">
          <div className="match-info-tag">
            <span>{kategorieName(match.kategorie)}</span>
            {match.isBookmarked && (
              <span>
                <img src={mark2} />
              </span>
            )}
          </div>
          <div className="match-modal-title">
            <p>{match.title}</p>
          </div>
          <div className="match-info-user">
            <button onClick={() => { setUserInfomation(match.userId); }}>{match.nickName}</button>
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
            <p>{formatTime(match.startTime)}</p>
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
                <div className="match-symbol-el" key={i}>
                  <div className="match-symbol">
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
                onClick={() => {
                  isAuth ? setShowJoinConfirm(true) : navigate("/user/Login");
                }}
              >
                {match.status === 0 && match.countPeople < match.people
                  ? "신청하기"
                  : "모집 완료"}
              </button>
              {match.hosted === 1 && (
                <button className="match-modal-btn-el" onClick={() => { setShowDeleteConfirm(true) }}>
                  매치 삭제
                </button>
              )}
              {match.hosted == 2 && (
                <button className="match-modal-btn-el" onClick={() => { setShowDeleteConfirm(true) }}>
                  참여 취소
                </button>
              )}
              {showJoinConfirm && (
                <div className="custom-confirm-modal">
                  <div className="custom-confirm-content">
                    <p>신청 하시겠습니까?</p>
                    <button onClick={handleJoin}>확인</button>
                    <button
                      onClick={() => {
                        setShowJoinConfirm(false);
                        setSelectMatch(null);
                      }}
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
              {showDeleteConfirm && (
                <div className="custom-confirm-modal">
                  <div className="custom-confirm-content">
                    <p>취소 하시겠습니까?</p>
                    <button onClick={handleDelete}>확인</button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setSelectMatch(null);
                      }}
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;
