import { useState, useEffect } from 'react';
import api from '../../axios';
import Chat from '../chat/Chat';


const FriendRight = () => {

  const [activeTab, setActiveTab] = useState('friend');

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
        setGroupChatRoom(response.data.groupChat)
      }).catch((error)=>{

      });
  }, [chatOpenRoom]);

  return (
    <section className="right">
      {chatOpenRoom && <Chat pos={activeTab} chatOpenRoom={chatOpenRoom} setChatOpenRoom={setChatOpenRoom} />}
      <div className="friendlist" style={{ display: chatOpenRoom ? 'none' : 'flex' }}>
        <div className={`myfriend ${activeTab === 'friend' ? 'active' : ''}`}
          onClick={() => setActiveTab('friend')}>친구</div>
        <div className={`im-in ${activeTab === 'group' ? 'active' : ''}`}
          onClick={() => setActiveTab('group')}>내가 참여한 매칭</div>
      </div>
      {activeTab === 'friend' ? (
        friendChatRoom.map((room, index) => (
          <div style={{ display: chatOpenRoom ? 'none' : 'flex' }} className="chatroom show" key={index} onClick={handleOpenChat} data-room-id={room.chatCode}>
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
       groupChatRoom.map((room, index) => (
          <div style={{ display: chatOpenRoom ? 'none' : 'flex' }} className="chatroom show" key={index} onClick={handleOpenChat} data-room-id={room.chatCode}>
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
      )}
    </section>
  );
};

export default FriendRight;
