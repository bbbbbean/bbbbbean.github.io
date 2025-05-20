import { useEffect, useState } from "react";
import { NavLink, replace } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../css/user_css/login.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../store"

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loginfail, setLoginFail] = useState("");


    const errorMessage = (errorCode) => {
        if (errorCode === '2') {
            setLoginFail("해당 소셜계정은 연동된 계정이 없습니다.");
        }
    };

    useEffect(() => {
        new URL(window.location.href).search
            .substring(1).replace("?", "").split("&")
            .forEach((item) => {
                if (!item.indexOf("errorCode")) {
                    const errorCode = item.split("=")[1]
                    errorMessage(errorCode);
                }
            });
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, { userId, password }, {
            "withCredentials": true
        })
            .then((response) => {
                localStorage.setItem("accessToken", response.data.jwtToken);
                localStorage.setItem("isAuth", true);

                const {
                    userId,
                    birthday,
                    name,
                    nickName,
                    points,
                    manner,
                    gender,
                    phone,
                    address,
                    introduction,
                    profile,
                } = response.data.userDTO;

                localStorage.setItem("userId", userId);
                localStorage.setItem("birthday", birthday);
                localStorage.setItem("name", name);
                localStorage.setItem("nickName", nickName);
                localStorage.setItem("points", points);
                localStorage.setItem("manner", manner);
                localStorage.setItem("gender", gender);
                localStorage.setItem("phone", phone);
                localStorage.setItem("address", address);
                localStorage.setItem("introduction", introduction);
                localStorage.setItem("profile", profile);
                localStorage.setItem("loginPlatform", 0);

                dispatch(login());

                navigate("/");
            })
            .catch(() => {
                setLoginFail("아이디 혹은 비밀번호가 일치하지 않습니다.")
                setPassword("");
                document.getElementById('password').focus();
            });
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="login-continer">
                <div className="login-tit">
                    <span>회원 로그인</span>
                    <span>{loginfail}</span>
                </div>
                <div className="login-id">
                    <input
                        type="text"
                        id="userId"
                        placeholder="아이디"
                        value={userId}
                        onChange={(e) => {
                            setUserId(e.target.value);
                            setLoginFail("");
                        }
                        }
                    />
                </div>
                <div className="login-pw">
                    <input
                        type="password"
                        id="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setLoginFail("");
                        }
                        }
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
                    {(userId.length && password) ?
                        <button type="submit">
                            <span>로그인</span>
                        </button>
                        :
                        <button type="button" style={{ backgroundColor: '#666666' }}>
                            <span>로그인</span>
                        </button>
                    }
                </div>
                <div className="login-menu">
                    <NavLink to="/user/signup">
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
                            <NavLink to="http://localhost:8100/oauth2/authorization/kakao" />
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
