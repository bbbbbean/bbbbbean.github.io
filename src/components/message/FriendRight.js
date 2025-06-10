import { useState, useEffect, useContext } from 'react';
import api from '../../axios';
import Chat from '../chat/Chat';
import { WebSocketContext } from '../../WebSocket';
import { useLocation } from "react-router-dom";


const FriendRight = ({ style1 = {}, style2 = {}, style3 = {}, ...props }) => {
  // 기본 style에 style prop이 있으면 덮어쓰기
  const mergedStyle = {
    ...style1,
  };
  const mergedStyle2 = {
    ...style3,
  };


  const [activeTab, setActiveTab] = useState('friend');
  const { openChat, setOpenChat, rooms, setRooms, friendUpdate } = useContext(WebSocketContext);

  const location = useLocation();

  const chatCode = location.state?.chatCode;

  console.log("FriendRight chatCode:", chatCode);

  useEffect(() => {
    if (chatCode) {
      setTimeout(() => {
        setOpenChat(chatCode);
      }, 1000); // 1초 후에 실행
    }
  }, []);



  const handleOpenChat = (e) => {
    const roomId = e.currentTarget.dataset.roomId;
    setOpenChat(roomId)
    // 읽음 처리
    setRooms(prevRooms => {
      return prevRooms.map(room => {
        if (room.chatCode === roomId) {
          return { ...room, unreadCount: 0 };
        }
        return room;
      });
    });
  }

  useEffect(() => {
    api.post('/api/chat/getChatRoom')
      .then(response => {
        const respRooms = [];
        response.data.friendChat.forEach(room => {
          respRooms.push({
            chatCode: room.chatCode,
            type: 'friend',
            imageUrl: room.imageUrl,
            nickName: room.nickName,
            unreadCount: room.unreadCount,
            lastMessage: room.lastMessage,
            lastMessageAt: room.lastMessageAt
          });
        });
        response.data.groupChat.forEach(room => {
          respRooms.push({
            chatCode: room.chatCode,
            type: 'group',
            imageUrl: room.imageUrl,
            nickName: room.nickName,
            unreadCount: room.unreadCount,
            lastMessage: room.lastMessage,
            lastMessageAt: room.lastMessageAt
          });
        });
        setRooms(respRooms);
      }).catch(() => {

      });
  }, [friendUpdate]);

  return (
    <section className="right" style={mergedStyle} {...props}>
      {openChat && <Chat pos={activeTab} openChat={openChat} setOpenChat={setOpenChat} style2={style2} />}
      <div className="friendlist" style={{ display: openChat ? 'none' : 'flex' }}>
        <div className={`myfriend ${activeTab === 'friend' ? 'active' : ''}`}
          onClick={() => setActiveTab('friend')}>친구</div>
        <div className={`im-in ${activeTab === 'group' ? 'active' : ''}`}
          onClick={() => setActiveTab('group')}>내가 참여한 매칭</div>
      </div>
      {!openChat &&
        <div className='chatroom-wrapper' style={mergedStyle2}>
          {activeTab === 'friend' ? (
            rooms.filter(room => room.type === 'friend').map((room, index) => (
              <div style={{ display: openChat ? 'none' : 'flex' }} className="chatroom show" key={index} onClick={handleOpenChat} data-room-id={room.chatCode}>
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
            rooms.filter(room => room.type === 'group').map((room, index) => (
              <div style={{ display: openChat ? 'none' : 'flex' }} className="chatroom show" key={index} onClick={handleOpenChat} data-room-id={room.chatCode}>
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
        </div>
      }
    </section>
  );
};

export default FriendRight;
