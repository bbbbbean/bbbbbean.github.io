import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../../css/user_css/login.css";

const LoginForm = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault(); // 폼 제출 막기
        // 로그인 로직 여기에 작성
        console.log("로그인 시도:", { userId, password, remember });
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
                        id="userid"
                        placeholder="아이디"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>
                <div className="login-pw">
                    <input
                        type="password"
                        id="pwd"
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
