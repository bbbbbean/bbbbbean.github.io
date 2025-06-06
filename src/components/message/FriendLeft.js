import searchIcon from "../../image/image_message/search-icon.svg"
import React, { useEffect, useState } from 'react';
import moreIcon from "../../image/image_message/more-icon.svg"
import api from "../../axios";

const FriendLeft = () => {
  const [friendRequest, setFriendRequest] = useState([]);
  const [bastFriends, setBastFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendSearch, setFriendSearch] = useState([]);
  const [friendfindValue, setFriendfindValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const friendsData = [
    { name: '친구 이름', intro: '한줄 소개입니당' },
    { name: '친구 이름', intro: '한줄 소개입니당' },
    { name: '친구 이름', intro: '한줄 소개입니당' },
    { name: '친구 이름', intro: '한줄 소개입니당' },
    { name: '친구 이름', intro: '한줄 소개입니당' },
    { name: '친구 이름', intro: '한줄 소개입니당' },
    { name: '친구 이름', intro: '한줄 소개입니당' },
    { name: '친구 이름', intro: '한줄 소개입니당' },
    { name: '친구 이름', intro: '한줄 소개입니당' },
    { name: '친구 이름', intro: '한줄 소개입니당' },
    { name: '친구 이름', intro: '한줄 소개입니당' },
  ];

  useEffect(() => {
    api.post("/api/friend/list").then((response) => {
      console.log(response.data.commonFriend);
      setFriends(response.data.commonFriend);
      setBastFriends(response.data.bestFriend);
      setFriendRequest(response.data.friendRequest);
    });
  }, [])
  const friendfind = (()=>{
    console.log(friendfindValue);
    api.post("/api/friend/findFriend",{"nickName":friendfindValue}).then((response)=>{
      console.log(response.data.friendFind);
      setFriendSearch(response.data.friendFind);
    })

  })

  return (
    <section className="left">
      <div className="all">
        <div className="friend">
          <h1>친구</h1>
        </div>
        <div className="find">
          <input type="text" placeholder="친구 검색하기" value={friendfindValue} onChange={(e) =>{
            setFriendfindValue(e.target.value);
          }}/>
          <button onClick={friendfind}>
            <img src={searchIcon} alt="친구찾기" />
          </button>
          <div style={{ display: friendSearch.length !== 0 ? "block" : "none" }} className="searchResult">
            {friendSearch.map((friend, idx) => (
              <div className="person">
                <img src={friend.profile} className="profile"></img>
                <div className="word1">
                  <div className="name">{friend.nickName}</div>
                  <div className="oneline">{friend.introduction}</div>
                </div>
                <div className="requestbuttons">
                  <button className="accept">신청</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="friendalart">
          <h1>친구 요청</h1>
          {friendRequest.map((friend, idx) => (
            <div className="person">
              <img src={friend.profile} className="profile"></img>
              <div className="word1">
                <div className="name">{friend.nickName}</div>
                <div className="oneline">{friend.introduction}</div>
              </div>
              <div className="requestbuttons">
                <button className="accept">수락</button>
                <button className="reject">거절</button>
              </div>
            </div>
          ))}
        </div>
        <div className="usually">
          <h1>즐겨찾는 친구</h1>
        </div>
        {bastFriends.map((friend, idx) => (
          <div className="person">
            <img src={friend.profile} className="profile"></img>
            <div className="word1">
              <div className="name">{friend.nickName}</div>
              <div className="oneline">{friend.introduction}</div>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <img src={moreIcon} alt="친구메뉴" />
            </button>
            <div className={`friendmenu ${menuOpen ? 'show' : ''}`}>
              <ul>
                <li>즐겨찾기 설정</li>
                <li>친구 삭제</li>
                <li>친구 차단</li>
                <li>신고하기</li>
              </ul>
            </div>
          </div>
        ))}
        <hr />
        {friends.map((friend, idx) => (
          <div className="person">
            <img src={friend.profile} className="profile"></img>
            <div className="word1">
              <div className="name">{friend.nickName}</div>
              <div className="oneline">{friend.introduction}</div>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <img src={moreIcon} alt="친구메뉴" />
            </button>
            <div className={`friendmenu ${menuOpen ? 'show' : ''}`}>
              <ul>
                <li>즐겨찾기 설정</li>
                <li>친구 삭제</li>
                <li>친구 차단</li>
                <li>신고하기</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FriendLeft;

