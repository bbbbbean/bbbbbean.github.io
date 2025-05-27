import { useEffect } from "react";

const Chat = ({pos, chatOpenRoom}) => {
    useEffect(() => {
        const matchChatContent = document.querySelector(".match-chat-content");

        matchChatContent.addEventListener("wheel", (e) => {
            e.preventDefault();
            matchChatContent.scrollTop += e.deltaY / 5;
        });

    }, []);

    return (
        <div className="match-chat-container">
            <div className="match-chat-title">
                <div className="match-chat-img">
                    <img
                        src="https://t1.daumcdn.net/friends/prod/editor/dc8b3d02-a15a-4afa-a88b-989cf2a50476.jpg"
                        alt="기본이미지"
                    />
                </div>
                <div className="match-chat-name">
                    <p>호스트 닉네임(기본)</p>
                    <span className="material-symbols-outlined">Person</span>
                    <span>8</span>
                </div>
            </div>
            <div className="match-chat-line"></div>
            <div className="match-chat-content" style={pos === "friend" ? { height: "82%" } : { height: "75%" }}>
                <div className="user-chat-container">
                    <img className="prf-image" src="" alt="prf-i" />
                    <div className="user-chat">
                        <div className="user-name">닉네임1</div>
                        <div className="user-content">경기도 시흥시 서울대학교에서 1월 22일 풋살경기합니다.</div>
                        <div className="user-chat-time">오후7:39</div>
                    </div>
                </div>
                <div className="user-chat-container">
                    <img className="prf-image" src="" alt="prf-i" />
                    <div className="user-chat">
                        <div className="user-name">닉네임2</div>
                        <div className="user-content">네</div>
                        <div className="user-chat-time">오후7:40</div>
                    </div>
                </div>
                <div className="your-chat-container">
                    <div className="user-chat">
                        <div className="your-content">시흥 서울대학교 스포츠파크</div>
                        <div className="your-chat-time">오후7:40</div>
                    </div>
                </div>
                <div className="your-chat-container">
                    <div className="user-chat">
                        <div className="your-content">채팅창위에 마우스를 놓고 마우스 휠을 움직여보세요</div>
                        <div className="your-chat-time">오후7:40</div>
                    </div>
                </div>
                <div className="your-chat-container">
                    <div className="user-chat">
                        <div className="your-content">
                            나의 말풍선......나의 말풍선......나의 말풍선......나의 말풍선......나의 말풍선......
                        </div>
                        <div className="your-chat-time">오후7:40</div>
                    </div>
                </div>
                <div className="your-chat-container">
                    <div className="user-chat">
                        <div className="your-content">
                            나의 말풍선......나의 말풍선......나의 말풍선......나의 말풍선......나의 말풍선......
                        </div>
                        <div className="your-chat-time">오후7:40</div>
                    </div>
                </div>
                <div className="your-chat-container">
                    <div className="user-chat">
                        <div className="your-content">
                            나의 말풍선......나의 말풍선......나의 말풍선......나의 말풍선......나의 말풍선......
                        </div>
                        <div className="your-chat-time">오후7:40</div>
                    </div>
                </div>
            </div>
            <div className="match-chat-input">
                <input type="text" />
                <button>
                    <span className="material-symbols-outlined">Send</span>
                </button>
            </div>
        </div>
    )
}

export default Chat;