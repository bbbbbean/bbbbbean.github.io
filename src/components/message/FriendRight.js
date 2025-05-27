import { useState } from 'react';
import moreIcon from "../../image/image_message/more-icon.svg"
import chatIcon from "../../image/image_message/chat-icon.svg"

const Friend = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [activeTab, setActiveTab] = useState('friend');

  return (
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
  );
};

export default Friend;
