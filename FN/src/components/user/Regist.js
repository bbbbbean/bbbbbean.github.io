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
                        message: "사용할 수 없는 아이디입니다.",
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
                if (resp.success) {

                }
                setAuth(true);
                setFormData((prev) => ({ ...prev, ["imp_uid"]: value }));
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
        <div className='join-form-wrap'>
            <section className="join-form-section">
                <div className='join-form-title'>
                    <p><span>회원</span>가입</p>
                </div>
                <form id="login-form" onSubmit={handleSubmit}>
                    <div className='join-form-part' id='join-form-plus'>
                        <div>
                            <label>아이디</label>
                            <input
                                id="userId"
                                type="text"
                                name="userId"
                                placeholder="아이디"
                                value={formData.userId}
                                onChange={handleChange}
                            />
                            <span style={{ color: idCheck.success ? '#4ebf8a' : '#dd3e3e', fontWeight: "bold" }} >{idCheck.message}</span>
                        </div>
                        <p>아이디에는 영문자와 숫자만 입력 가능합니다</p>
                    </div>
                    <div className='join-form-part' id='join-form-plus'>
                        <div>
                            <label>닉네임</label>
                            <input
                                type="text"
                                name="nickName"
                                placeholder="사용자 닉네임"
                                value={formData.nickName}
                                onChange={handleChange}
                            />
                        </div>
                        <p>닉네임은 2글자 이상 10글자 이하만 가능합니다</p>
                    </div>
                    <div className='join-form-part' id='join-form-plus'>
                        <div>
                            <label>비밀번호</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="비밀번호"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <p>비밀번호는 대소문자와 숫자, 특수문자를 포함한 8~15자로 이루어져야 합니다</p>
                    </div>
                    <div className='join-form-part' id='join-form-plus'>
                        <div>
                            <label>비밀번호 확인</label>
                            <input
                                type="password"
                                name="repassword"
                                placeholder="비밀번호 확인"
                                value={formData.repassword}
                                onChange={handleChange}
                            />
                        </div>
                        <p></p>
                    </div>
                    <p className='join-form-error'>{AuthError}</p>
                    <button type="button" className={Auth && "success"} onClick={Auth ? dummy : handleAuth}>
                        {Auth ? "인증성공" : "본인인증"}
                    </button>

                    {Auth && formData.password && formData.repassword && formData.nickName &&
                        <button className="submit" type="submit">
                            회원가입
                        </button>
                    }
                    <button className="join-form-login-btn" onClick={() => navigate("/user/login")}>
                        계정이 있으신가요? 로그인
                    </button>
                </form>


            </section>
        </div>
    );
};

export default Regist;
