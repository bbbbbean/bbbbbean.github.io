import React, { useEffect, useState } from "react";

import "../../css/user_css/userInfo_sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserName } from "../../store";


const MyPageSiderbar = ({profile}) => {

  const dispatch = useDispatch();
  
  const url = useLocation().pathname.split("/")[2];

  const [activeMenu, setActiveMenu] = useState(url);
  const userId = localStorage.getItem("userId");
  const nickName = useSelector((state) => state.user.userName);
  const [manner, setManner] = useState(localStorage.getItem("manner") / 6 +0.5);

  const menuItems = [
    { label: "내 정보", url: "" },
    { label: "내 정보 관리", url: "edit_my_info" },
    { label: "비밀번호 변경", url: "edit_my_password" },
    { label: "계정 연동", url: "account_link" },
    { label: "회원 탈퇴", url: "delete_account" },
  ];

  useEffect(() => {
    const nickname = localStorage.getItem("nickName");
    if (nickname) {
      dispatch(setUserName(nickname));
    }
  }, [dispatch]);

  return (
    <div className="info-left">
      <div className="info-score">
        <span>My</span>
        <span>매너</span>
        <span style={{paddingLeft:'5px', color:'#dd3e3e', fontWeight:'bold'}}>{manner <= 20 && "매너지수가 낮습니다" }</span>
        <div className="manner-gauge-bar">
          <p style={{ width: `${manner}%`}}></p>
        </div>
        <div style={{ textAlign: "end", color: "#6B6B6B" }}>60단위</div>
      </div>

      <div className="info-user-profile">
        <img src={profile} alt="프로필 이미지" />
      </div>

      <div className="info-user">
        <div className="user-name">
          <p>{nickName}</p>
        </div>
        <div className="user-id">
          <p>{userId}</p>
        </div>
      </div>

      <div className="info-menu">
        {menuItems.map((item, index) => (
          <React.Fragment key={item.url}>
            <div
              className={`item ${activeMenu === item.url ? "active" : ""}`}
              onClick={() => setActiveMenu(item.url)}
            >
              <NavLink to={`/mypage/${item.url}`}>{item.label}</NavLink>
            </div>
            {index !== menuItems.length - 1 && <span />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MyPageSiderbar;
