import { Route, Routes } from 'react-router-dom';

import "../../css/user_css/userInfo.css";

import MyPageSiderbar from "../user/MypageSidebar";
import Mypage from "../user/Mypage";
import UserEdit from "../user/UserEdit";
import PwdEdit from "../user/PwdEdit";
import AccountLink from "../user/AccountLink";
import UserDelete from "../user/UserDelete";
import { useState } from 'react';


const MyPageLayout = () => {

    const [profile, setProfile] = useState(localStorage.getItem("profile"));

    return (
        <div className="info-container">
            <MyPageSiderbar profile={profile}/>
            <Routes>
                <Route path="/" element={<Mypage />} />
                <Route path="/edit_my_info" element={<UserEdit profile={profile} setProfile={setProfile} />} />
                <Route path="/edit_my_password" element={<PwdEdit />} />
                <Route path="/account_link" element={<AccountLink />} />
                <Route path="/delete_account" element={<UserDelete />} />
            </Routes>
        </div>
    );
};
export default MyPageLayout;
