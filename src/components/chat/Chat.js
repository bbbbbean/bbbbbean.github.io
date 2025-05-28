import { useEffect, useContext, useState } from "react";
import { WebSocketContext } from '../../WebSoket';
import api from '../../axios'

const Chat = ({ pos, chatOpenRoom, setChatOpenRoom }) => {

    const [mainImage, setMainImage] = useState("");
    const [title, setTitle] = useState("");
    const [userCount, setUserCount] = useState(0);
    const [Message, setMessage] = useState([]);
    const [inputMessage, setInputMessage] = useState("");

    const client = useContext(WebSocketContext);
    console.log(chatOpenRoom);

    const handleClose = () => {
        setChatOpenRoom(null);
    }

    const getChatMessage = () => {
        api.post("api/chat/getChatMessage", { "chatCode": chatOpenRoom })
            .then((response) => {
                const resData = response.data?.data;

                setMainImage(resData.mainImage || "");
                setTitle(resData.title || "");

                const formattedMessages = (resData.messages ?? []).map(msg => ({
                    ...msg,
                    createAt: new Date(msg.createAt).toLocaleString("ko-KR", {
                        hour12: false,
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                }));

                console.log(formattedMessages);

                setMessage(formattedMessages);

                setTimeout(() => {
                    const chatContent = document.querySelector(".match-chat-content");
                    if (chatContent) {
                        chatContent.scrollTop = chatContent.scrollHeight;
                    }
                }, 0);
            })
            .catch((err) => {
                console.error("getChatMessage 오류:", err);
            });

    }

    useEffect(() => {
        let subscription = null;
        if (client && client.connected && chatOpenRoom) {
            subscription = client.subscribe(`/sub/room/${chatOpenRoom}`, (message) => {

                const data = JSON.parse(message.body);
                console.log(data);

                if (data.ok === "ok") {
                    if (pos === 'friend') {
                        getChatMessage();
                    } else if (pos === 'group') {

                    }
                    return;
                }

                // 바로바로 읽음 처리
                api.post("/api/chat/readChat", { "messageId": data.messageId, "chatCode": chatOpenRoom })
                    .then((response) => {
                        console.log(response);
                    }).catch((error) => {

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

                setMessage(prev => [...prev, formattedData]);
                // 메시지 도착 시 스크롤을 맨 아래로 이동
                setTimeout(() => {
                    const chatContent = document.querySelector(".match-chat-content");
                    if (chatContent) {
                        chatContent.scrollTop = chatContent.scrollHeight;
                    }
                }, 0);
            });

            client.publish({
                destination: "/pub/enter",
                body: JSON.stringify({ "roomId": chatOpenRoom })
            });
        };

        return () => {
            subscription.unsubscribe();
        };

    }, [chatOpenRoom]);


    useEffect(() => {
        const matchChatContent = document.querySelector(".match-chat-content");

        matchChatContent.addEventListener("wheel", (e) => {
            e.preventDefault();
            matchChatContent.scrollTop += e.deltaY / 5;
        });

    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if(inputMessage.trim() === ""){
            return;
        }
        setInputMessage("");
        client.publish({
            destination: '/pub/message',
            body: JSON.stringify({ "content": inputMessage, "roomId": chatOpenRoom }),
        });
        setTimeout(() => {
            document.querySelector(".match-chat-input input").focus();
        }, 0);
    }

    return (
        <div className="match-chat-container">
            <div className="match-chat-title">
                <div className="match-chat-img">
                    <img
                        src={mainImage}
                        alt="기본이미지"
                    />
                </div>
                {userCount != 0 ?
                    <div className="match-chat-name">
                        <p>{title}</p>
                        <span className="material-symbols-outlined">Person</span>
                        <span>{userCount}</span>
                    </div>
                    :
                    <div className="match-chat-name">
                        <p style={{ fontSize: "26px", fontWeight: "bold", lineHeight: "50px" }}>{title}</p>
                    </div>}
                <div className="match-chat-close">
                    <span className="material-symbols-outlined" onClick={handleClose}>Close</span>
                </div>
            </div>
            <div className="match-chat-line"></div>
            <div className="match-chat-content" style={pos === "friend" || pos === "group" ? { height: "82%" } : { height: "75%" }}>
                {Message.map((msg, index) => (
                    msg.userId === localStorage.getItem("userId") ? (
                        <div key={index} className="your-chat-container">
                            <div className="user-chat">
                                <div className="your-content">
                                    <span>{msg.isRead === 0 ? "" : msg.isRead}</span>
                                    <span>{msg.content}</span>
                                </div>
                                <div className="your-chat-time">{msg.createAt}</div>
                            </div>
                        </div>
                    ) : (
                        <div key={index} className="user-chat-container">
                            <img className="prf-image" src={`${process.env.REACT_APP_SERVER_URL}/profile/${msg.userId}`} alt="prf-i" />
                            <div className="user-chat">
                                <div className="user-name">{msg.nickName}</div>
                                <div className="user-content">
                                    <span>{msg.content}</span>
                                    <span>{msg.isRead === 0 ? "" : msg.isRead}</span>
                                </div>
                                <div className="user-chat-time">{msg.createAt}</div>
                            </div>
                        </div>
                    )
                ))}
            </div>
            <div className="match-chat-input">
                <form onSubmit={sendMessage}>
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <button>
                        <span className="material-symbols-outlined">Send</span>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Chat;