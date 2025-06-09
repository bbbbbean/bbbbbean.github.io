import { useEffect, useState } from 'react';
import '../../css/user_css/signup.css';
import logo from '../../image/로고_color.png'
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const PasswordSearch = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const { imp_uid: impUidFromState, Auth: authFromState } = location.state || {};

    const [formData, setFormData] = useState({
        userId: "",
        password: "",
        repassword: "",
        imp_uid: impUidFromState || "",
    });

    const [Auth, setAuth] = useState(!!authFromState);
    
    useEffect(() => {
        let script = document.createElement("script");
        script.src = "https://cdn.iamport.kr/v1/iamport.js"
        script.async = true;
        document.body.appendChild(script);
    }, []);

    // imp_uid가 넘어온 경우 상태 업데이트
    useEffect(() => {
        if (impUidFromState) {
            setFormData(prev => ({ ...prev, imp_uid: impUidFromState }));
        }
        if (authFromState !== undefined) {
            setAuth(!!authFromState);
        }
    }, [impUidFromState, authFromState]);

    const [AuthError, setAuthError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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
                    setAuth(true);
                    setFormData((prev) => ({ ...prev, ["imp_uid"]: value }));
                }
            },
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/pwEdit`, { "authCheck": Auth, ...formData })
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
                    {Auth && formData.password && formData.repassword &&
                        <button className="submit" type="submit">
                            비밀번호 변경
                        </button>
                    }

                </form>
            </section>
        </div>
    );
};

export default PasswordSearch;
