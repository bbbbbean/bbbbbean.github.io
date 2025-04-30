import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import "../../css/user_css/userInfo.css";

import MyPageSiderbar from "./MypageSidebar";
import Mypage from "./Mypage";
import PasswordCheck from "./Pwdcheck";
import UserEdit from "./UserEdit";
import PwdEdit from "./PwdEdit";
import AccountLink from "./AccountLink";
import UserDelete from "./UserDelete";


const MyPageLayout = () => {
    return (
        <div className="info-container">
            <MyPageSiderbar />
            <Routes>
                <Route path="/" element={<Mypage />} />
                <Route path="/password_check" element={<PasswordCheck />} />
                <Route path="/edit" element={<UserEdit />} />
                <Route path="/edit_my_password" element={<PwdEdit />} />
                <Route path="/account_link" element={<AccountLink />} />
                <Route path="/delete_account" element={<UserDelete />} />

            </Routes>
        </div>
    );
};
export default MyPageLayout;
