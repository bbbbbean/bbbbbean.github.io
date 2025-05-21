import React, { useState } from "react";
import { useEffect } from "react";
import api from "../../axios"
import UserCalender from "../calendar/UserCalender";

import "../../css/user_css/myPage.css";

const MyPageSection = () => {

  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [errorTag, setErrorTag] = useState("");

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

    api.post("/api/user/getTag", { "userId": localStorage.getItem("userId") })
      .then((response) => {
        setTags([...response.data.tags]);
      })
      .catch((error) => {
      });

  }, []);

  const tagAdd = (e) => {
    e.preventDefault();
    if (tag.trim() === "") {
      return;
    }
    api.post("/api/user/addTag", { "userId": localStorage.getItem("userId"), "tag": tag.trim() })
      .then((response) => {
        if (response.status !== 200) {
          setErrorTag(response.data.error);
          setTag("");
          return;
        }
        setTags([...response.data.tags]);
        setTag("");
      })
      .catch((error) => {
        console.log(error);
        setTag("");
      });
    ;
  };

  const tagDel = (e) => {
    const tag = e.currentTarget.dataset.tag;
    api.post("/api/user/delTag", { "userId": localStorage.getItem("userId"), tag })
      .then((response) => {
        setTags([...response.data.tags]);
      })
      .catch((error) => {
      });
    ;
  }


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
        <span style={{paddingLeft:"5px",color: '#dd3e3e', fontWeight:"bold"}}>{errorTag}</span>
        <div className="date-tag">
          {tags.map((tag, idx) => (
            <div key={idx} className="tag-item drag-prevent" data-tag={tag} onClick={tagDel}>
              {tag}
              <span>-</span>
            </div>
          ))}
          {tags.length < 10 &&
            <div className="tag-add">
              <form onSubmit={tagAdd}>
                <input
                  type="text"
                  id="tag"
                  placeholder="태그추가"
                  value={tag}
                  onChange={(e) => {
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.substring(0, 10);
                    }
                    setTag(e.target.value);
                    setErrorTag("");
                  }}
                />
              </form>
            </div>}
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
          <UserCalender />
        </div>
      </div>
    </div>
  );
};

export default MyPageSection;
