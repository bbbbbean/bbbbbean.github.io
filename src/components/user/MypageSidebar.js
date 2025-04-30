import React, { useState } from "react";

import "../../css/user_css/userInfo_sidebar.css";
import profile from "../../image/user/profile.png"
import { NavLink } from "react-router-dom";

const MyPageSiderbar = () => {
  const [activeMenu, setActiveMenu] = useState("Mypage");

  const menuItems = [
    { label: "내 정보", url: "" },
    { label: "내 정보 관리", url: "password_check" },
    { label: "비밀번호 변경", url: "edit_my_password" },
    { label: "계정 연동", url: "account_link" },
    { label: "회원 탈퇴", url: "delete_account" },
  ];

  return (
    <div className="info-left">
      <div className="info-score">
        <span>My</span>
        <span>매너</span>
        <div className="manner-gauge-bar">
            <p></p>
        </div>
        <div style={{ textAlign: "end", color: "#6B6B6B" }}>60단위</div>
      </div>

      <div className="info-user-profile">
        <img src={profile} alt="프로필 이미지" />
      </div>

      <div className="info-user">
        <div className="user-name">
          <p>admin</p>
        </div>
        <div className="user-id">
          <p>admin</p>
        </div>
      </div>

      <div className="info-menu">
        {menuItems.map((item, index) => (
          <React.Fragment key={item.url}>
            <div
              className={`item ${activeMenu === item.url ? "active" : ""}`}
              onClick={() => setActiveMenu(item.url)}
            >
              <NavLink to={`/user/mypage/${item.url}`}>{item.label}</NavLink>
            </div>
            {index !== menuItems.length - 1 && <span />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MyPageSiderbar;
