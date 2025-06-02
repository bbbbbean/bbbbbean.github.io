import { useEffect, useRef, createContext, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useSelector } from 'react-redux';
import LodingPage from "./Loding";
import api from "./axios"

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {

    const clientRef = useRef(null);
    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [openChat, setOpenChat] = useState(null);
    const [messages, setMessages] = useState([]);

    // 방(채팅방) 정보 상태
    const [rooms, setRooms] = useState([]);

    const hasConnectedRef = useRef(false);

    // 현재 구독정보 //
    const openChatRef = useRef(openChat);

    useEffect(() => {
        openChatRef.current = openChat;
    }, [openChat]);

    const isAuth = useSelector(state => state.auth.isAuth);

    const showMessageInChat = (data) => {

        // 바로바로 읽음 처리
        api.post("/api/chat/readChat", { "messageId": data.messageId, "chatCode": openChatRef.current })
            .then((response) => {
            }).catch(() => {

            });

        const formattedData = {
            ...data,
            createAt: new Date(data.createAt).toLocaleString("ko-KR", {
                hour12: false,
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }),
            isRead: data.isRead - data.subscriberCount
        };
        setMessages(prevMessages => [...prevMessages, formattedData]);
    };

    const incrementUnreadCount = (roomId, data) => {
        setRooms(prevRooms => {
            return prevRooms.map(room => {
                if (room.chatCode === roomId) {
                    const content = data.content;
                    const shortMessage = content.length > 8 ? content.substring(0, 8) + "..." : content;
                    return { ...room, unreadCount: room.unreadCount + 1, lastMessage: shortMessage }
                }
                return room;
            });
        });
    };

    useEffect(() => {
        const isAuth = localStorage.getItem("isAuth");
        if (!isAuth || hasConnectedRef.current) return;

        setConnected(false);
        hasConnectedRef.current = true;

        setTimeout(() => {
            let sub;
            const stompClient = new Client({
                webSocketFactory: () => new SockJS(`${process.env.REACT_APP_SERVER_URL}/ws-stomp`, null, { withCredentials: true }),
                onConnect: () => {
                    console.log('Connected');
                    const userId = localStorage.getItem("userId");
                    console.log('User ID:', userId);
                    sub = stompClient.subscribe(`/sub/user/${userId}`, (message) => {
                        const data = JSON.parse(message.body);
                        const roomId = data.chatCode;
                        if (roomId === openChatRef.current) {
                            showMessageInChat(data);
                        } else {
                            incrementUnreadCount(roomId, data);
                        }
                    });

                    setClient(stompClient);
                    setConnected(true);
                },
                onWebSocketError: (error) => {
                    console.error('웹소켓 연결 실패:', error);
                },
                onStompError: (frame) => {
                    console.error('STOMP error', frame);
                },
                onDisconnect: () => {
                    console.log('Disconnected');
                    if (sub) sub.unsubscribe();
                    clientRef.current = null;
                    setClient(null);
                    setConnected(false);
                    setOpenChat(null);
                    setMessages([]);
                    setRooms([]);
                    hasConnectedRef.current = false;
                    openChatRef.current = null;
                    setConnected(false);
                    stompClient.deactivate();
                },
                onWebSocketClose: () => {
                    api.post("/api").then((response) =>{
                    }).catch((error) => {
                        if(isAuth){
                            window.location.reload();
                        }
                    });
                }
            });

            stompClient.activate();

            clientRef.current = stompClient;

        }, 1000);

        return () => {
            if (clientRef.current && clientRef.current.connected) {
                clientRef.current.deactivate();
                hasConnectedRef.current = false;
            }
        };
    }, [isAuth]);

    if (!connected && isAuth) {

        return <LodingPage />
    }

    return (
        <WebSocketContext.Provider value={{ client, openChat, setOpenChat, messages, setMessages, rooms, setRooms }}>
            {children}
        </WebSocketContext.Provider>
    );
};



