import api from "../../axios"
import { Link } from "react-router-dom";
import { useContext } from "react";
import "../../css/common_css/information_pro.css"

const InformationPro = ({ userInfo }) => {
  //const { profile, nickName, name, userId, birthday, introduction, gender, address} = userInfo;

  console.log(userInfo);
  return (
        <div className="info-container">
            <div className="info-content">
                <div className="info-header">
                    <h2>유저 정보</h2>
                </div>
                <div className="info-list">
                </div>
            </div>
        </div>
)}
export default InformationPro;