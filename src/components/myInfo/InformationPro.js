import api from "../../axios"
import { Link } from "react-router-dom";
import { useContext } from "react";
import "../../css/common_css/information_pro.css"

const InformationPro = ({ userInfo }) => {
  //const { profile, nickName, name, userId, birthday, introduction, gender, address} = userInfo;

  console.log(userInfo);
  return (
        <div className="friendInfoContainer">
            <div className="friendInfoContent">
                <div className="friendInfoHeader">
                    <h2>유저 정보</h2>
                </div>
                <div className="friendInfoList">
                    <ul>
                        <li><div>사진</div></li>
                        <li>친구 닉네임</li>
                        <li>친구 아이디</li> 
                        <li>친구 소개</li> 
                        <li>친구 이름 / 성별</li>
                        <li>친구 생일</li>
                        <li>친구 활동지역</li>
                    </ul>
                </div>
            </div>
        </div>
)}
export default InformationPro;