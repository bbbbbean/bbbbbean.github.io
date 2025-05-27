import searchIcon from "../../image/image_message/search-icon.svg"
import React, { useState } from 'react';
import moreIcon from "../../image/image_message/more-icon.svg"

const FriendItem = ({ name, intro, onClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="person">
      <div className="profile"></div>
      <div className="word1" onClick={onClick}>
        <div className="name">{name}</div>
        <div className="oneline">{intro}</div>
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
  );
};

const FriendLeft = () => {
    
    const friendsData = [
      { name: '친구 이름', intro: '한줄 소개입니당' },
      { name: '친구 이름', intro: '한줄 소개입니당' },
      { name: '친구 이름', intro: '한줄 소개입니당' },
      { name: '친구 이름', intro: '한줄 소개입니당' },
      { name: '친구 이름', intro: '한줄 소개입니당' },
      { name: '친구 이름', intro: '한줄 소개입니당' },
      { name: '친구 이름', intro: '한줄 소개입니당' },
      { name: '친구 이름', intro: '한줄 소개입니당' },
    ];

    return (
        <section className="left">
            <div className="all">
                <div className="friend">
                    <h1>친구</h1>
                </div>
                <div className="find">
                    <input type="text" placeholder="친구 검색하기" />
                    <button>
                        <img src={searchIcon} alt="친구찾기" />
                    </button>
                </div>
                <div className="usually">
                    <h1>즐겨찾는 친구</h1>
                </div>
                {friendsData.slice(0, 2).map((friend, idx) => (
                    <FriendItem key={idx} {...friend} />
                ))}
                <hr />
                {friendsData.slice(2).map((friend, idx) => (
                    <FriendItem key={idx + 2} {...friend}/>
                ))}
            </div>
        </section>
    )
}

export default FriendLeft;

