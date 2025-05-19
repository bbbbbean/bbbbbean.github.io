import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../store"

const Logout = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();


    useEffect(() => {

        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/logout`);

        const platform = Number(localStorage.getItem("loginPlatform"));

        localStorage.clear();
        dispatch(logout());

        switch (platform) {
            case 1: // ���̹�
                return;
            case 2: // īī��
                window.location.href = "https://kauth.kakao.com/oauth/logout?client_id=107a759f0613ca4e0b89fda38d805341&logout_redirect_uri=http://localhost:3000/user/login";
                return;
            case 3: // ����
                return;
        }
        navigate("/user/login");
    }, []);
};

export default Logout;
