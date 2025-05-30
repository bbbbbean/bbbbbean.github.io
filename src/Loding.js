import { useEffect, useState } from "react";
import LodingIcon from "./image/loding.webp";

const LodingPage = () => {
    const [showFirstMessage, setShowFirstMessage] = useState(1);
    const [dat, setDat] = useState("");

    useEffect(() => {
        let count = 1;
        const interval1 = setInterval(() => {
            setShowFirstMessage(++count%5 + 1);
        }, 3000);
        const interval2 = setInterval(() => {
            setDat((prev) => {
                if (prev.length >= 4) return ".";
                return prev + ".";
            });
        }, 1000);

        return () => {
            clearInterval(interval1);
            clearInterval(interval2);
        }
    }, []);

    return (
        <div className="loding-page drag-prevent">
            <img src={LodingIcon} alt="로딩중" />
            {showFirstMessage === 1 && <p>로딩중입니다{dat}</p>}
            {showFirstMessage === 2 && <p>조금 더 기다려주세요. 곧 완료됩니다!{dat}</p>}
            {showFirstMessage === 3 && <p>잠시만 기다려주세요{dat}</p>}
            {showFirstMessage === 4 && <p>서버가 힘들어하는 중입니다{dat}</p>}
            {showFirstMessage === 5 && <p>잠시 후 다시 시도해주세요{dat}</p>}
            <button onClick={()=>{window.location.href="/user/logout";}}>로그아웃</button>
        </div>
        
    );
};

export default LodingPage;
