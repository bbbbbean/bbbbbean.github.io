import { useEffect, useContext, useState } from "react";
import { WebSocketContext } from '../../WebSocket';
import api from '../../axios'
const Chat = ({ pos, openChat, setOpenChat }) => {

    const [mainImage, setMainImage] = useState("");
    const [title, setTitle] = useState("");
    const [userCount, setUserCount] = useState(0);
    const [inputMessage, setInputMessage] = useState("");
    const [entered, setEntered] = useState(true);

    const { client, messages, setMessages } = useContext(WebSocketContext);

    const handleClose = () => {
        setOpenChat(null);
    }

    const getChatMessage = () => {
        api.post("api/chat/getChatMessage", { "chatCode": openChat })
            .then((response) => {
                const resData = response.data?.data;
                console.log(resData);

                setMainImage(resData.mainImage || "");
                setTitle(resData.title || "");
                setUserCount(resData.userCount);

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

                setMessages(formattedMessages);
            });
    }

    useEffect(() => {
        if (entered) {
            setEntered(false);
            return;
        }
        setTimeout(() => {
            const chatContent = document.querySelector(".match-chat-content");
            if (chatContent) {
                chatContent.scrollTop = chatContent.scrollHeight;
            }
        }, 0);
    }, [messages]);

    useEffect(() => {
        const subscription = client.subscribe(`/sub/count/${openChat}`, (message) => {
            const data = JSON.parse(message.body);
            console.log(data);
            if(data.isOk){
                console.log("채팅방 입장 성공");
                setEntered(true);
            }
            getChatMessage();
        });
        client.publish({
            destination: "/pub/enter",
            body: JSON.stringify({ "roomId": openChat })
        });

         setTimeout(() => {
            const chatContent = document.querySelector(".match-chat-content");
            if (chatContent) {
                chatContent.scrollTop = chatContent.scrollHeight;
            }
        }, 0);
        return () => {
            if(subscription){
                subscription.unsubscribe();
            }
        }
    }, [openChat]);


    useEffect(() => {
        const matchChatContent = document.querySelector(".match-chat-content");

        matchChatContent.addEventListener("wheel", (e) => {
            e.preventDefault();
            matchChatContent.scrollTop += e.deltaY / 5;
        });

    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (inputMessage.trim() === "") {
            return;
        }
        setInputMessage("");
        client.publish({
            destination: '/pub/message',
            body: JSON.stringify({ "content": inputMessage, "roomId": openChat }),
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
                {messages.map((msg, index) => (
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