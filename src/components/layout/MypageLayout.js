import { Route, Routes } from 'react-router-dom';

import "../../css/user_css/userInfo.css";

import MyPageSiderbar from "../user/MypageSidebar";
import Mypage from "../user/Mypage";
import PasswordCheck from "../user/Pwdcheck";
import UserEdit from "../user/UserEdit";
import PwdEdit from "../user/PwdEdit";
import AccountLink from "../user/AccountLink";
import UserDelete from "../user/UserDelete";


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
