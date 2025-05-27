import { useState, useContext, useEffect, use } from 'react';
import moreIcon from "../../image/image_message/more-icon.svg"
import api from '../../axios';
import Chat from '../chat/Chat';
// import { WebSocketContext } from '../../WebSoket';

const FriendRight = () => {

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

  const [friendChatRoom, setFriendChatRoom] = useState([]);
  const [groupChatRoom, setGroupChatRoom] = useState([]);
  const [chatOpenRoom, setChatOpenRoom] = useState(null);

  const handleOpenChat = (e) => {
    setChatOpenRoom(e.currentTarget.dataset.roomId)
  }

  useEffect(() => {
    api.post('/api/chat/getChatRoom')
      .then(response => {
        console.log(response.data);
        setFriendChatRoom(response.data.friendChat);
      });
  }, []);

  return (
    <section className="right">
      {chatOpenRoom && <Chat pos="friend" chatOpenRoom={chatOpenRoom} />}
      <div className="friendlist" style={{ display: chatOpenRoom ? 'none' : 'flex' }}>
        <div className={`myfriend ${activeTab === 'friend' ? 'active' : ''}`}
          onClick={() => setActiveTab('friend')}>친구</div>
        <div className={`im-in ${activeTab === 'match' ? 'active' : ''}`}
          onClick={() => setActiveTab('match')}>내가 참여한 매칭</div>
      </div>
      {activeTab === 'friend' ? (
        friendChatRoom.map((room, index) => (
          <div style={{ display: chatOpenRoom ? 'none' : 'flex' }}> className="chatroom show" key={index} onClick={handleOpenChat} data-room-id={room.chatCode}>
            <div className="chatimage">
              <img src={room.imageUrl} alt={room.nickName} />
            </div>
            <div className="word1">
              <div className="chatname">{room.nickName}</div>
              <div className="oneline">{room.lastMessage}</div>
            </div>
            {room.unreadCount > 0 && <div className='chatnum'>{room.unreadCount}</div>}
          </div>
        ))

      ) : (
        <div className="chatroom show">
          <div className="morechatimage"></div>
          <div className="word1">
            <div className="chatname">단체 채팅방</div>
            <div className="oneline"> 최근 채팅 내용</div>
          </div>
          <div className='chatnum'>12</div>
        </div>
      )}
    </section>
  );
};

export default FriendRight;
