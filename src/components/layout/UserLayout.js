import { Route, Routes } from 'react-router-dom';
import Login from "../user/Login";
import Logout from "../user/Logout";
import Regist from '../user/Regist';
import IdSearch from '../user/IdSearch';
import PasswordSearch from '../user/PaswwordSearch';


const UserLayout = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<Regist />} />
            <Route path="/idSearch" element={<IdSearch />} />
            <Route path="/pwSearch" element={<PasswordSearch />} />
        </Routes>
    );
};
export default UserLayout;
