import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../css/user_css/login.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store"

const LoginForm = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const isAuth = useSelector(state => state.auth.isAuth);
    const dispatch = useDispatch();

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post("/api/auth/login", { userId, password })
            .then((response) => {
                localStorage.setItem("accessToken", response.data.jwtToken);

                const {
                    userId,
                    email,
                    name,
                    nickName,
                    points,
                    isPrivate,
                    manner,
                    gender,
                    introduction,
                } = response.data.userDTO;

                localStorage.setItem("userId", userId);
                localStorage.setItem("email", email);
                localStorage.setItem("name", name);
                localStorage.setItem("nickName", nickName);
                localStorage.setItem("points", points);
                localStorage.setItem("isPrivate", isPrivate);
                localStorage.setItem("manner", manner);
                localStorage.setItem("gender", gender);
                localStorage.setItem("introduction", introduction);

                dispatch(login());

                navigate("/");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="login-continer">
                <div className="login-tit">
                    <span>회원 로그인</span>
                </div>
                <div className="login-id">
                    <input
                        type="text"
                        id="userId"
                        placeholder="아이디"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>
                <div className="login-pw">
                    <input
                        type="password"
                        id="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="login-check">
                    <input
                        type="checkbox"
                        id="remember-check"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                    />{" "}
                    <span>아이디 저장하기</span>
                </div>
                <div className="login-btn">
                    <button type="submit">
                        <span>로그인</span>
                    </button>
                </div>
                <div className="login-menu">
                    <NavLink to="/user/register">
                        <span>회원가입</span>
                    </NavLink>
                    <span>|</span>
                    <a href="#">
                        <span>아이디찾기</span>
                    </a>
                    <span>|</span>
                    <a href="#">
                        <span>비밀번호찾기</span>
                    </a>
                </div>
                <div className="sns-login">
                    <span>SNS 계정으로 간편하게 로그인하세요</span>
                    <ul>
                        <li>
                            <a href="#"></a>
                        </li>
                        <li>
                            <a href="#"></a>
                        </li>
                        <li>
                            <a href="#"></a>
                        </li>
                    </ul>
                </div>
            </div>
        </form>
    );
};

export default LoginForm;
