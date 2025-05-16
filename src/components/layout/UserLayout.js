import { Route, Routes } from 'react-router-dom';
import Login from "../user/Login";
import Logout from "../user/Logout"
import Regist from '../user/Regist';


const UserLayout = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<Regist />} />
        </Routes>
    );
};
export default UserLayout;
