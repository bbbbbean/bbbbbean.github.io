import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Test = () => {
    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8100/ws-stomp'),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected');
                client.subscribe('/sub/room/1', (message) => {
                    if (message.body) {
                        const data = JSON.parse(message.body);
                        console.log('Received message:', data);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('STOMP error', frame);
            },
        });

        if (!client.connected) {
            client.activate();
        }

        return () => {
            client.deactivate(); // 컴포넌트 언마운트 시 연결 해제
        };
    }, []);

    return <div>WebSocket 테스트 중...</div>;
};

export default Test;
