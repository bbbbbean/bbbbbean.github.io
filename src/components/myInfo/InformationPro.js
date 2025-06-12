import api from "../../axios"
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import "../../css/common_css/information_pro.css"
import { WebSocketContext } from "../../WebSocket";
import cake from "../../image/image_index/cake.svg";
import location from "../../image/image_index/pin.svg";

const InformationPro = () => {
    const { userInfomation, setUserInfomation } = useContext(WebSocketContext);
    const [info, setInfo] = useState([]);
    const [tags, setTags] = useState([]);
    useEffect(() => {
        if (userInfomation !== "") {
            api.post("/api/user/information", { "userId": userInfomation }).then((response) => {
                setInfo(response.data.userInfo);
                setTags(response.data.tags);
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
                        <li className="info-profile"><img src={info.profile} /></li>
                        <li className="info-nick">{info.nickName}</li>
                        <li className="info-id">{info.userId}</li>
                        <li className="info-intro"><p>{info.introduction}</p></li>
                        {info.name && <li className="info-etc"><p>{info.name}</p><p>{info.gender}</p><p><img src={cake}/>{info.birthdayMonth}/{info.birthdayDay}</p><p><img src={location}/>{info.address}</p></li>  }
                    </ul>
                    {tags.map((tag, idx) => (
                        <span key={idx} className="tag">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default InformationPro;