import { useState } from 'react';
import '../../css/message_css/message.css';
import moreIcon from "../../image/image_message/more-icon.svg"
import searchIcon from "../../image/image_message/search-icon.svg"
import chatIcon from "../../image/image_message/chat-icon.svg"

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

const FriendItem = ({ name, intro }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="person">
      <div className="profile"></div>
      <div className="word1">
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


const Friend = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className='friend-container'>
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
            <FriendItem key={idx + 2} {...friend} />
          ))}
        </div>
      </section>

      <section className="right">
        <div className="nonechat">
          <img src={chatIcon} alt="채팅" />
          <div className="startchat">친구와 채팅 시작하기</div>
        </div>
        <div className="friendlist">
          <div className="myfriend">친구</div>
          <div className="im-in">내가 참여한 매칭</div>
        </div>
        {/* ------------------------------ */}
        <div className='chatroom'>
          <div className="chatimage"></div>
          <div className="word1">
            <div className="chatname">채팅방 이름</div>
            <div className="oneline"> 최근 채팅 내용</div>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <img src={moreIcon} alt="채팅메뉴" />
          </button>
          <div className={`chatmenu ${menuOpen ? 'show' : ''}`}>
            <ul>
              <li>채팅방 나가기</li>
              <li>신고하기</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Friend;
