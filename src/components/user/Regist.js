import { useEffect, useState } from 'react';
import '../../css/user_css/signup.css';
import logo from '../../image/로고_color.png'
import axios from 'axios';

const Regist = () => {

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
        Auth: "",
    });

    const [Auth, setAuth] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAuth = () => {
        window.IMP.init("imp08830045");

        window.IMP.certification(
            {
                // param
                channelKey: "channel-key-168ba60d-6f3e-42f0-aae7-471b8d1f9e23",
                merchant_uid: "MIIiasTest", // 주문 번호
                m_redirect_url: "", // 모바일환경에서 popup:false(기본값) 인 경우 필수, 예: https://www.myservice.com/payments/complete/mobile
                popup: true, // PC환경에서는 popup 파라미터가 무시되고 항상 true 로 적용됨
            },
            function (resp) {
                const value = resp.imp_uid;
                setAuth(true);
                setFormData((prev) => ({ ...prev, ["Auth"]: value }));
                if (resp.success) {
                    setAuth(true);
                    setFormData((prev) => ({ ...prev, ["Auth"]: value }));
                }
            },
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("/").then((response) =>{

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
                <h1>
                    임시값 : {formData.Auth} / {Auth ? "true" : "false"}
                </h1>
                <form id="login-form" onSubmit={handleSubmit}>
                    <label>
                        <input
                            type="text"
                            name="userId"
                            placeholder="아이디"
                            value={formData.userId}
                            onChange={handleChange}
                        />
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
