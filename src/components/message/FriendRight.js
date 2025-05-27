import { useState, useContext, useEffect, use } from 'react';
import moreIcon from "../../image/image_message/more-icon.svg"
import api from '../../axios';
// import { WebSocketContext } from '../../WebSoket';

const FriendRight = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('friend');

  //const client = useContext(WebSocketContext);

  // useEffect(() => {
  //   let subscription = null;
  //   if (client && client.connected) {
  //     subscription = client.subscribe('/sub/room/1', (message) => {
  //       const data = JSON.parse(message.body);
  //       console.log('Received message:', data);
  //     });
  //     client.publish({
  //       destination: '/pub/api/chat/message',
  //       body: JSON.stringify({ content: 'Hello, World!', sender: 'test', roomId: 1 }),
  //     });
  //   };

  //   return () => {
  //     subscription.unsubscribe();
  //   };

  // }, [client]);

  const [friendChatRoom, setFriendChatRoom] = useState(
    [
      {
        id: 1,
        nickName: '친구1',
        lastMessage: '안녕하세요!',
        unreadCount: 2,
        imageUrl: 'a'
      },
      {
        id: 2,
        nickName: '친구2',
        lastMessage: '오랜만이에요!',
        unreadCount: 11,
        imageUrl: 'b'
      },
    ]
  );
  const [groupChatRoom, setGroupChatRoom] = useState([]);

  // api.post('/api/chat/getChatRoom')
  //   .then(response => {
  //     setFriendChatRoom(response.data.friendChatRoom);
  //     setGroupChatRoom(response.data.groupChatRoom);
  //   });

  useEffect(() => {

  }, []);

  return (
    <section className="right">
      <div className="friendlist">
        <div className={`myfriend ${activeTab === 'friend' ? 'active' : ''}`}
          onClick={() => setActiveTab('friend')}>친구</div>
        <div className={`im-in ${activeTab === 'match' ? 'active' : ''}`}
          onClick={() => setActiveTab('match')}>내가 참여한 매칭</div>
      </div>
      {activeTab === 'friend' ? (
        friendChatRoom.map((room, index) => (
          <div className="chatroom show" key={index}>
          <div className="chatimage">
            <img src={room.imageUrl} alt={room.nickName} />
          </div>
          <div className="word1">
            <div className="chatname">{room.nickName}</div>
            <div className="oneline">{room.lastMessage}</div>
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
          <div className='chatnum'>{room.unreadCount}</div>
        </div>
        ))
        
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

export default FriendRight;
