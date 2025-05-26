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


const Friend = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [activeTab, setActiveTab] = useState('friend');

    const handleFriendClick = (friend) => {
      if(selectedFriend === friend) {
        setSelectedFriend(null);
      }else {
        setSelectedFriend(friend);
      }
    };
  
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
            <FriendItem key={idx} {...friend} onClick={() => handleFriendClick(friend)} />
          ))}
          <hr />
          {friendsData.slice(2).map((friend, idx) => (
            <FriendItem key={idx + 2} {...friend} onClick={() => handleFriendClick(friend)} />
          ))}
        </div>
      </section>

      <section className="right">
        <div className="friendlist">
          <div className={`myfriend ${activeTab === 'friend' ? 'active' : ''}`}
            onClick={() => setActiveTab('friend')}>친구</div>
          <div className={`im-in ${activeTab === 'match' ? 'active' : ''}`}
            onClick={() => setActiveTab('match')}>내가 참여한 매칭</div>
        </div>
        {activeTab === 'friend' ? (
          selectedFriend ? (
            <div className="chatroom show">
              <div className="chatimage"></div>
              <div className="word1">
                <div className="chatname">친구 이름</div>
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
              <div className='chatnum'>12</div>
            </div>
          ) : (
            <div className="nonechat">
              <img src={chatIcon} alt="채팅" />
              <div className="startchat">친구와 채팅 시작하기</div>
            </div>
          )
        ) : (
          <div className="chatroom show">
            <div className="morechatimage"></div>
            <div className="word1">
              <div className="chatname">단체 채팅방</div>
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
            <div className='chatnum'>12</div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Friend;
