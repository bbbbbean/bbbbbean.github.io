import searchIcon from "../../image/image_message/search-icon.svg"
import React, { useEffect, useState } from 'react';
import moreIcon from "../../image/image_message/more-icon.svg"
import api from "../../axios";

const FriendLeft = () => {
  const [friendRequest, setFriendRequest] = useState([]);
  const [bestFriends, setBestFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendSearch, setFriendSearch] = useState([]);
  const [friendfindValue, setFriendfindValue] = useState("");
  const [menuOpen, setMenuOpen] = useState({});
  const [openMenuKey, setOpenMenuKey] = useState(null);
  const handleMenuToggle = (key) => {
    setOpenMenuKey(prev => (prev === key ? null : key));
  };

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
      setBestFriends(response.data.bestFriend);
      setFriendRequest(response.data.friendRequest);
    });
  }, [])
  const friendfind = (()=>{
    console.log(friendfindValue);
    api.post("/api/friend/findFriend",{"nickName":friendfindValue}).then((response)=>{
      console.log(response.data.friendFind);
      setFriendSearch(response.data.friendFind);
    });
  })
  const friendStatus = ((userId, newStatus)=>{
  console.log("변경할 친구 ID:", userId);
  console.log("새로운 상태 값:", newStatus);

  api.post("/api/friend/friendStatus", {
    friendId: userId,
    status: newStatus
  })
  .then((response) => {
    console.log("상태 변경 완료:", response.data);
  })
  .catch((error) => {
    console.error("상태 변경 실패:", error);
  });
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
        {bestFriends.map((friend, idx) => (
          <div className="person" key={`best-${idx}`}>
            <img src={friend.profile} className="profile"></img>
            <div className="word1">
              <div className="name">{friend.nickName}</div>
              <div className="oneline">{friend.introduction}</div>
            </div>
            <button onClick={() => handleMenuToggle(`best-${idx}`)}>
              <img src={moreIcon} alt="친구메뉴" />
            </button>
            <div className={`friendmenu ${openMenuKey === `best-${idx}` ? 'show' : ''}`}>
              <ul>
                <li onClick={() => friendStatus(friend.userId, 0)}>즐겨찾기 해제</li>
                <li>친구 삭제</li>
                <li onClick={() => friendStatus(friend.userId, 2)}>친구 차단</li>
                <li>신고하기</li>
              </ul>
            </div>
          </div>
        ))}
        <hr />
        {friends.map((friend, idx) => (
          <div className="person" key={`common-${idx}`}>
            <img src={friend.profile} className="profile"></img>
            <div className="word1">
              <div className="name">{friend.nickName}</div>
              <div className="oneline">{friend.introduction}</div>
            </div>
            <button onClick={() => handleMenuToggle(`common-${idx}`)}>
              <img src={moreIcon} alt="친구메뉴" />
            </button>
            <div className={`friendmenu ${openMenuKey === `common-${idx}` ? 'show' : ''}`}>
              <ul>
                <li onClick={() => friendStatus(friend.userId, 1)}>즐겨찾기 설정</li>
                <li>친구 삭제</li>
                <li onClick={() => friendStatus(friend.userId, 2)}>친구 차단</li>
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

