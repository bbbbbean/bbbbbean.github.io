import { useEffect, useRef, createContext, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useSelector } from 'react-redux';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const clientRef = useRef(null);
    const [client, setClient] = useState(null);
    const [connected, setConnected] = useState(false); // 🔹 연결 상태 추가

    const hasConnectedRef = useRef(false);
    const isAuth = useSelector(state => state.auth.isAuth);

    useEffect(() => {
        const isAuth = localStorage.getItem("isAuth");
        if (!isAuth || hasConnectedRef.current) return;

        hasConnectedRef.current = true;

        const stompClient = new Client({
            webSocketFactory: () => new SockJS(`${process.env.REACT_APP_SERVER_URL}/ws-stomp`),
            onConnect: () => {
                console.log('Connected');
                setClient(stompClient);
                setConnected(true); // 🔹 연결 완료 표시
            },
            onStompError: (frame) => {
                console.error('STOMP error', frame);
            },
            onDisconnect: () => {
                console.log('Disconnected');
                hasConnectedRef.current = false;
                setConnected(false);
            }
        });

        stompClient.activate();
        clientRef.current = stompClient;

        return () => {
            if (clientRef.current && clientRef.current.connected) {
                clientRef.current.deactivate();
                hasConnectedRef.current = false;
            }
        };
    }, [isAuth]);

    if (!connected && isAuth) {
        return <div>웹소켓 연결 중...</div>;
    }

    return (
        <WebSocketContext.Provider value={client}>
            {children}
        </WebSocketContext.Provider>
    );
};



