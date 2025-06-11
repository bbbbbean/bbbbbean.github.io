import axios from 'axios';
import { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../store"
import { WebSocketContext } from '../../WebSocket';

const Logout = () => {

    const { client } = useContext(WebSocketContext);

    const navigate = useNavigate();

    const dispatch = useDispatch();


    const platformNum = Number(localStorage.getItem("loginPlatform"));

    console.log(platformNum);

    localStorage.clear();

    useEffect(() => {
        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/logout`, {}, {
            withCredentials: true
        }).catch((error) => {
        });

        dispatch(logout());


        switch (platformNum) {
            case 1: // 네이버
                window.open('https://nid.naver.com/nidlogin.logout');
                break;
            case 2: // 카카오
                window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&logout_redirect_uri=http://localhost:3000/user/login`;
                return;
            case 3: // 구글
                return;
        }

        navigate("/user/login")

        if (client) {
            client.deactivate();
        }
    }, []);
};

export default Logout;
