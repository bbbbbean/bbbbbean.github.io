import React from "react";
import { useEffect } from "react";

import "../../css/user_css/myPage.css";

const MyPageSection = () => {
  useEffect(() => {
    const prevMatchScroll = document.querySelector('.prev-match');
    const bookMarkScroll = document.querySelector('.book-mark-container');

    prevMatchScroll.addEventListener("wheel", (e) => {
      e.preventDefault();
      prevMatchScroll.scrollTop += e.deltaY / 5;
    });
    bookMarkScroll.addEventListener("wheel", (e) => {
      e.preventDefault();
      bookMarkScroll.scrollTop += e.deltaY / 5;
    });
  }, []);
  const tags = [
    "#대구", "#봉명동", "#남구", "#동성로", "#부산",
    "#운동", "#배구", "#야구", "#게임", "#배틀그라운드"
  ];

  const matches = Array(10).fill({
    date: "23.10.01",
    description: "시흥 서울대학교 스포츠파크(풋살) 11VS11"
  });

  const bookmarks = Array(4).fill({
    day: "1월 22일",
    type: "5vs5",
    mode: "온라인",
    title: "발로란트 내전 5vs5 너만오면 고",
    tag: "게임"
  });

  return (
    <div className="info-right">
      <div className="user-info-title">
        <div className="info-title">
          <span>My</span>
          <span>Page</span>
        </div>
      </div>

      <div className="user-info-tag info-title">
        <span>My</span>
        <span>Tag</span>
        <div className="date-tag">
          {tags.map((tag, idx) => (
            <div key={idx} className="tag-item">{tag}</div>
          ))}
          <div className="tag-item tag-add">+</div>
        </div>
      </div>

      <div className="user-info-match info-title">
        <span>My</span>
        <span>Match</span>
        <div className="user-info-match-content">
          <div className="left">
            <div className="title">지난 매치</div>
            <span></span>
            <div className="prev-match">
              {matches.map((match, idx) => (
                <React.Fragment key={idx}>
                  <a href="#">
                    <div className="prev-match-item">
                      <span>{match.date}</span>
                      <span>{match.description}</span>
                    </div>
                  </a>
                  <span></span>
                </React.Fragment>
              ))}
            </div>
            <span></span>
          </div>

          <div className="right">
            <div className="title">북마크</div>
            <div className="book-mark-container">
              {bookmarks.map((item, idx) => (
                <div key={idx} className="book-mark-item">
                  <a href="#">
                    <div className="day">{item.day}</div>
                    <div className="info">
                      <span>{item.type}</span>
                      <span>{item.mode}</span>
                    </div>
                    <div className="title">{item.title}</div>
                    <div className="tag">{item.tag}</div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="user-info-calendar info-title">
        <span>My</span>
        <span>Calendar</span>
        <div className="calendar-container">
          {/* 캘린더 컴포넌트 삽입 가능 */}
        </div>
      </div>
    </div>
  );
};

export default MyPageSection;
