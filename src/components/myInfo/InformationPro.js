import api from "../../axios"
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import "../../css/common_css/information_pro.css"
import { WebSocketContext } from "../../WebSocket";

const InformationPro = () => {
    const { userInfomation, setUserInfomation } = useContext(WebSocketContext);
    const [info, setInfo] = useState([]);
    useEffect(() => {
        if (userInfomation !== "") {
            api.post("/api/user/infomation", { "userId": userInfomation }).then((response) => {
                setInfo(response.data);
                console.log(response.data);
            }).catch(error => {

            });
        }
    }, [userInfomation])
    return (
        <div className="friendInfoContainer" style={userInfomation ? { width: "300px" } : {}}>
            <div className="friendInfoContent">
                <div className="friendInfoHeader">
                    <h2>유저 정보</h2>
                    <button className="close" onClick={() => setUserInfomation("")}>x</button>
                </div>
                <div className="friendInfoList">
                    <ul>
                        <li><img src={info.profile} /></li>
                        <li>{info.nickName}</li>
                        <li>{info.userId}</li>
                        <li>{info.introduction}</li>
                        {info.name ? <li>{info.name} / {info.gender}</li> : <li>비공개</li>}
                        {info.name ? <li>{info.birthdayMonth}월 {info.birthdayDay}일</li> : <li>비공개</li>}
                        <li>{info.address}</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default InformationPro;