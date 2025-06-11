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
        <div className='find-pw-info-wrap'>
            <section className="find-pw-info-section">
                <div className='find-pw-info-title'>
                    <p><span>비밀번호</span> 변경</p>
                </div>
                <form id="find-pw-info-form" onSubmit={handleSubmit}>
                    <div className='find-pw-info-form-part' id='find-pw-info-form-plus'>
                        <div>
                            <label>아이디 확인</label>
                            <input
                                id="userId"
                                type="text"
                                name="userId"
                                placeholder="아이디"
                                value={formData.userId}
                                onChange={handleChange}
                            />
                        </div>
                        <p>아이디에는 영문자와 숫자만 입력 가능합니다</p>
                    </div>
                    <div className='find-pw-info-form-part' id='find-pw-info-form-plus'>
                        <div>
                            <label>새로운 비밀번호</label>
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
                    <div className='find-pw-info-form-part' id='find-pw-info-form-plus'>
                        <div>
                            <label>새 비밀번호 확인</label>
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
