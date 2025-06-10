import React, { use, useState } from "react";
import { useEffect } from "react";
import api from "../../axios";
import UserCalendar from "../calendar/UserCalendar";

import "../../css/user_css/myPage.css";

const MyPageSection = () => {
  const [tags, setTags] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [preMatches, setPreMatches] = useState([]);
  const [tag, setTag] = useState("");
  const [errorTag, setErrorTag] = useState("");

  useEffect(() => {
    const prevMatchScroll = document.querySelector(".prev-match");
    const bookMarkScroll = document.querySelector(".book-mark-container");

    prevMatchScroll.addEventListener("wheel", (e) => {
      e.preventDefault();
      prevMatchScroll.scrollTop += e.deltaY / 5;
    });
    bookMarkScroll.addEventListener("wheel", (e) => {
      e.preventDefault();
      bookMarkScroll.scrollTop += e.deltaY / 5;
    });

    api
      .post("/api/user/getTag")
      .then((response) => {
        setTags([...response.data.tags]);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    api
      .post("/api/user/bookMark")
      .then((response) => {
        console.log(response.data);
        setBookmarks([...response.data]);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    api
      .post("/api/user/prevMatch")
      .then((response) => {
        console.log(response.data);
        setPreMatches([...response.data]);
      })
      .catch((error) => {});
  }, []);

  const tagAdd = (e) => {
    e.preventDefault();
    if (tag.trim() === "") {
      return;
    }
    api
      .post("/api/user/addTag", { tag: tag.trim() })
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
  };

  const tagDel = (e) => {
    const tag = e.currentTarget.dataset.tag;
    api
      .post("/api/user/delTag", { tag })
      .then((response) => {
        setTags([...response.data.tags]);
      })
      .catch((error) => {});
  };

  const formatDate = (localDate) => {
    const date = new Date(localDate);
    const year = String(date.getFullYear()).slice(2);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}년 ${month}월 ${day}일`;
  };

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
        <span
          style={{ paddingLeft: "5px", color: "#dd3e3e", fontWeight: "bold" }}
        >
          {errorTag}
        </span>
        <p>엔터를 치면 태그가 등록됩니다</p>
        <div className="date-tag">
          {tags.map((tag, idx) => (
            <div
              key={idx}
              className="tag-item drag-prevent"
              data-tag={tag}
              onClick={tagDel}
            >
              {tag}
              <span>-</span>
            </div>
          ))}
          {tags.length < 10 && (
            <div className="tag-add">
              <form onSubmit={tagAdd}>
                <input
                  type="text"
                  id="tag"
                  placeholder="태그추가"
                  value={tag}
                  onChange={(e) => {
                    if (e.target.value.length > 6) {
                      e.target.value = e.target.value.substring(0, 6);
                    }
                    setTag(e.target.value);
                    setErrorTag("");
                  }}
                />
              </form>
            </div>
          )}
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
              {preMatches.map((match, idx) => {
                return (
                  <React.Fragment>
                    <a href="#">
                      <div className="prev-match-item">
                        <span>{formatDate(match.startTime)}</span>
                        <span>{match.title}</span>
                        <span>{match.location}</span>
                      </div>
                    </a>
                    <span></span>
                  </React.Fragment>
                );
              })}
            </div>
            <span></span>
          </div>

          <div className="right">
            <div className="title">북마크</div>
            <div className="book-mark-container">
              {bookmarks.map((item, idx) => (
                <div key={idx} className="book-mark-item">
                  <a href="#">
                    <div className="day">
                      {item.month}월 {item.day}일
                    </div>
                    <div className="info">
                      <span>{item.location}</span>
                    </div>
                    <div className="title">{item.title}</div>
                    <div className="tag">{item.kategorie}</div>
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
          <UserCalendar />
        </div>
      </div>
    </div>
  );
};

export default MyPageSection;
