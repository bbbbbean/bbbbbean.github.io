import { useEffect, useCallback, useContext, useState } from "react";
import { WebSocketContext } from '../../WebSocket';
import api from '../../axios'
import imageApi from '../../ImageAxios'
import { useDropzone } from 'react-dropzone'
import FileIcon from "../../image/file.svg"
import UploadIcon from "../../image/upload.svg"
import "../../css/message_css/chatting.css";

const Chat = ({ pos, openChat, setOpenChat, style2 }) => {

    const [mainImage, setMainImage] = useState("");
    const [title, setTitle] = useState("");
    const [userCount, setUserCount] = useState(0);
    const [inputMessage, setInputMessage] = useState("");
    const [entered, setEntered] = useState(true);
    const [file, setFile] = useState(null);
    const [inputFileName, setInputFileName] = useState("");

    const onDrop = useCallback(acceptedFiles => {
        setInputMessage("");
        setInputFileName(acceptedFiles[0].name);
        setFile(acceptedFiles[0]);
    }, [])
    const onCancel = () => {
        setInputFileName("")
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const { client, messages, setMessages } = useContext(WebSocketContext);

    const handleClose = () => {
        setOpenChat(null);
    }

    const getChatMessage = () => {
        api.post("api/chat/getChatMessage", { "chatCode": openChat })
            .then((response) => {

                const resData = response.data.data;

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
                    }),
                }));
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
                chatContent.scrollTo({
                    top: chatContent.scrollHeight,
                    behavior: "smooth"
                });
            }
        }, 100);
    }, [messages]);

    useEffect(() => {
        const subscription = client.subscribe(`/sub/count/${openChat}`, (message) => {
            const data = JSON.parse(message.body);
            if (data.isOk) {
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
            chatContent.scrollTo({
                top: chatContent.scrollHeight,
                behavior: "auto"
            });
        }, 200);
        return () => {
            if (subscription) {
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
        if (inputMessage.trim() === "" && file == null) {
            return;
        }
        if (!(inputMessage.trim() === "")) { // Message
            client.publish({
                destination: '/pub/message',
                body: JSON.stringify({ "content": inputMessage, "roomId": openChat }),
            });
        } else { // File
            imageApi.post("/api/chat/fileUpload", { "roomId": openChat, "file": file })
                .then((response) => {
                });
        }

        setTimeout(() => {
            setInputMessage("");
            setInputFileName("");
            setFile(null);
            document.querySelector(".match-chat-input input").focus();
        }, 0);
    }

    // mergedStyle에 height가 없으면 기본값으로 "75%"를 지정
    const chatContentStyle = {
        ...style2,
        height: style2 && style2.height ? style2.height : "82%"
    };

    return (
        <div className="match-chat-container" style={{marginRight:"10px", marginLeft:"0", height: "770px"}}>
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
            <div className="match-chat-content" style={chatContentStyle}>
                {messages.map((msg, index) => (
                    msg.userId === localStorage.getItem("userId") ? (
                        <div key={index} className="your-chat-container">
                            <div className="user-chat">
                                {msg.isFile ? (
                                    <div className="your-content">
                                        <span>{msg.isRead === 0 ? "" : msg.isRead}</span>
                                        {msg.fileType === "image" ?
                                            <img src={msg.content} /> :
                                            msg.fileType === "video" ?
                                                <video src={msg.content} controls autoPlay loop />
                                                :
                                                <a href={msg.content} download>
                                                    {msg.fileName}
                                                </a>
                                        }
                                    </div>
                                ) : (
                                    <div className="your-content">
                                        <span>{msg.isRead === 0 ? "" : msg.isRead}</span>
                                        <span>{msg.content}</span>
                                    </div>
                                )}
                                <div className="your-chat-time">{msg.createAt}</div>
                            </div>
                        </div>
                    ) : (
                        <div key={index} className="user-chat-container">
                            <img className="prf-image" src={`${process.env.REACT_APP_SERVER_URL}/profile/${msg.userId}`} alt="prf-i" />
                            <div className="user-chat">
                                <div className="user-name">{msg.nickName}</div>
                                {msg.isFile ? (
                                    <div className="user-content">
                                        {msg.fileType === "image" ?
                                            <img src={msg.content} style={{ maxWidth: "400px" }} /> :
                                            msg.fileType === "video" ?
                                                <video src={msg.content} style={{ maxWidth: "400px" }} controls autoPlay loop />
                                                :
                                                <a href={msg.content} download>
                                                    {msg.fileName}
                                                </a>
                                        }
                                        <span>{msg.isRead === 0 ? "" : msg.isRead}</span>
                                    </div>
                                ) : (
                                    <div className="user-content">
                                        <span>{msg.content}</span>
                                        <span>{msg.isRead === 0 ? "" : msg.isRead}</span>
                                    </div>
                                )}
                                <div className="user-chat-time">{msg.createAt}</div>
                            </div>
                        </div>
                    )
                ))}
            </div >
            <div className="match-chat-input">
                <p style={{ cursor: "pointer" }} onClick={onCancel}>{inputFileName}</p>
                <form onSubmit={sendMessage}>
                    <input readOnly={inputFileName && true}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <input style={{ display: "none" }} {...getInputProps()} />
                    <button>
                        <span className="material-symbols-outlined">Send</span>
                    </button>
                </form>
                <div className="file-input" {...getRootProps()}>
                    {
                        isDragActive ?
                            <img src={UploadIcon} alt="업로드아이콘" /> :
                            <img src={FileIcon} alt="파일아이콘" />
                    }
                </div>
            </div>
        </div >
    )
}

export default Chat;