import { useEffect, useRef, createContext, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useSelector } from 'react-redux';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {

    const clientRef = useRef(null);
    const [client, setClient] = useState(null);

    const hasConnectedRef = useRef(false);

    const isAuth = useSelector(state => state.auth.isAuth);

    useEffect(() => {
        
        const isAuth = localStorage.getItem("isAuth");
        if (!isAuth || hasConnectedRef.current) {
            return;
        }

        hasConnectedRef.current = true;

        clientRef.current = new Client({
            webSocketFactory: () => new SockJS(`${process.env.REACT_APP_SERVER_URL}/ws-stomp`),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected');
            },
            onStompError: (frame) => {
                console.error('STOMP error', frame);
            },
        });

        clientRef.current.activate();

        setClient(clientRef.current);

        return () => {
            if (clientRef.current && clientRef.current.connected) {
                clientRef.current.deactivate();
                hasConnectedRef.current = false;
            }
        };
    }, [isAuth]);

    return (
        <WebSocketContext.Provider value={client}>
            {children}
        </WebSocketContext.Provider>
    );
}


