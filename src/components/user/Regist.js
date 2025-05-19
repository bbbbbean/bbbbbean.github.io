import { useEffect, useState } from 'react';
import '../../css/user_css/signup.css';
import logo from '../../image/로고_color.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Regist = () => {

    const navigate = useNavigate();

    useEffect(() => {
        let script = document.createElement("script");
        script.src = "https://cdn.iamport.kr/v1/iamport.js"
        script.async = true;
        document.body.appendChild(script);
    }, [])

    const [formData, setFormData] = useState({
        userId: "",
        nickName: "",
        password: "",
        repassword: "",
        imp_uid: "",
    });

    const [idCheck, setIdCheck] = useState({
        message: "",
        success: false
    });
    const [Auth, setAuth] = useState(false);

    const [AuthError, setAuthError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (formData.userId.trim() === "") {
                return;
            }
            console.log(formData.userId);
            axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/check-id`, { "userId": formData.userId })
                .then((response) => {
                    setIdCheck({
                        message: "사용 가능한 아이디입니다.",
                        success: true
                    });
                })
                .catch((error) => {
                    setIdCheck({
                        message: "이미 사용중인 아이디입니다.",
                        success: false
                    });
                });
        }, 1000);

        return () => {
            clearTimeout(timerId);
        }
    }, [formData.userId])

    const handleAuth = () => {
        setAuthError("");
        window.IMP.init(`${process.env.REACT_APP_PORTONE_IMP}`);

        window.IMP.certification(
            {
                // param
                channelKey: `${process.env.REACT_APP_PORTONE_CHANNEL_KEY}`,
                merchant_uid: `${process.env.REACT_APP_PORTONE_MERCHANT_UID}`, // 주문 번호
                m_redirect_url: "", // 모바일환경에서 popup:false(기본값) 인 경우 필수, 예: https://www.myservice.com/payments/complete/mobile
                popup: true, // PC환경에서는 popup 파라미터가 무시되고 항상 true 로 적용됨
            },
            function (resp) {
                const value = resp.imp_uid;
                setAuth(true);
                setFormData((prev) => ({ ...prev, ["imp_uid"]: value }));
                if (resp.success) {
                    setAuth(true);
                    setFormData((prev) => ({ ...prev, ["imp_uid"]: value }));
                }
            },
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!idCheck.success) {
            document.getElementById("userId").focus();
            return;
        }
        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/sign`, { "authCheck": Auth, "idCheck": idCheck.success, ...formData })
            .then(() => {
                navigate("/user/login");
            })
            .catch((error) => {
                setAuthError(error.response.data.fail);
                if (error.response.data.authReset) {
                    setAuth(false);
                }
            });
    };

    const dummy = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <section className="login-section">
                <img src={logo} alt="logo" />
                <h2>
                    임시 회원가입 페이지입니다.
                    <br />
                    사용하고 있는 비밀번호를 입력하지 마세요.
                </h2>
                <form id="login-form" onSubmit={handleSubmit}>
                    <label>
                        <input
                            id="userId"
                            type="text"
                            name="userId"
                            placeholder="아이디"
                            value={formData.userId}
                            onChange={handleChange}
                        />
                        <span style={{ color: idCheck.success ? '#4ebf8a' : '#dd3e3e', fontWeight: "bold" }} >{idCheck.message}</span>
                    </label>
                    <label>
                        <input
                            type="text"
                            name="nickName"
                            placeholder="사용자 닉네임"
                            value={formData.nickName}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        <input
                            type="password"
                            name="repassword"
                            placeholder="비밀번호 확인"
                            value={formData.repassword}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="button" className={Auth && "success"} onClick={Auth ? dummy : handleAuth}>
                        {Auth ? "인증성공" : "본인인증"}
                    </button>
                    <span style={{ color: "#dd3e3e", fontWeight: "bold" }}>{AuthError}</span>
                    {Auth &&
                        <button className="submit" type="submit">
                            회원가입
                        </button>
                    }

                </form>
            </section>
            <section className="no-account-section">
                <span>계정이 있으신가요?</span>
                <a href="?page=user/Login">로그인</a>
            </section>
        </div>
    );
};

export default Regist;
