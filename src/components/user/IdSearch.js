import { useEffect, useState } from 'react';
import '../../css/user_css/signup.css';
import logo from '../../image/로고_color.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const IdSearch = () => {

    const navigate = useNavigate();

    useEffect(() => {
        let script = document.createElement("script");
        script.src = "https://cdn.iamport.kr/v1/iamport.js"
        script.async = true;
        document.body.appendChild(script);
    }, [])

    const [Auth, setAuth] = useState(false);
    const [userId, setUserId] = useState("");
    const [impUid, setImpUid] = useState("");
    const [AuthError, setAuthError] = useState("");


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
                    setImpUid(value);
                    handleSubmit(true, value);
                }
            },
        );
    };

    const handleSubmit = (ok, value) => {
        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/idSearch`, { "authCheck": ok, "imp_uid" : value })
            .then((response) => {
                setUserId(response.data.userId);
            })
            .catch((error) => {
                setAuthError(error.response.data.fail);
                if (error.response.data.authReset) {
                    setAuth(false);
                }
            });
    };

    const handlePassword = (e) =>{
        e.preventDefault()
        console.log(impUid, Auth);
        navigate("/user/pwSearch", {
            state: { imp_uid: impUid, Auth: Auth}
        });
    }

    const dummy = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <section className="login-section">
                <img src={logo} alt="logo" />
                <form id="login-form" onSubmit={handleSubmit}>
                    <label>회원정보에 등록한 휴대전화로 인증</label>
                    <span>회원정보에 등록한 휴대전화 번호와 입력한 휴대전화 번호가 같아야합니다.</span>
                    <button type="button" className={Auth && "success"} onClick={Auth ? dummy : handleAuth}>
                        {Auth ? "인증성공" : "본인인증"}
                    </button>
                    <span style={{ color: "#dd3e3e", fontWeight: "bold" }}>{AuthError}</span>
                    {userId != "" && 
                    <>
                        <span>아이디</span><span style={{ color: "#4ebf8a", fontWeight: "bold" }}>{userId}</span>
                        <button type="button" onClick={handlePassword}>비밀번호 찾기</button>
                    </>
                    }
                </form>
            </section>
        </div>
    );
};

export default IdSearch;
