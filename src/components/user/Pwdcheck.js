import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../axios"

const PasswordCheck = ({ }) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleConfirmClick = (e) => {
        e.preventDefault();
        instance.post("/api/auth/myInfoPwdCheck", { "userId": localStorage.getItem("userId"), password })
            .then((response) => {
                console.log("실행됨");
                console.log(response);
                if (response.data.success) {
                    navigate("/user/mypage/edit");
                } else {
                    setPassword("")
                    setMessage(response.data.message);
                    document.getElementById('password').focus();
                }
            })
            .catch((error) => {
                console.log(error);
            })
    };

    return (

        <div className="info-right">
            <div className="user-info-title">
                <div className="info-title">
                    <span>내정보</span>
                    <span>관리</span>
                </div>

                <div className="user-info-content">
                    <span></span>
                    <div className="password-check">
                        <div className="password-check-form info-edit">
                            <h2>비밀번호를 확인하세요</h2>
                            <p>비밀번호를 입력하여 계속하세요</p>
                            <span style={{ color: '#dd3e3e' }}>{message}</span>
                            <br />
                            <form onSubmit={handleConfirmClick}>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="비밀번호"
                                    value={password}
                                    onChange={(e) => {
                                        if (e.target.value.length > 15) {
                                            e.target.value = e.target.value.substring(0, 15);
                                        }
                                        setPassword(e.target.value)
                                        setMessage("");
                                    }}
                                />
                                <br />
                                {(password.length >= 4) ?
                                    <button className="btn-submit-password" type="submit">
                                        확인
                                    </button>
                                    :
                                    <button className="btn-submit-password" type="button" style={{ backgroundColor: '#666666' }}>
                                        확인
                                    </button>
                                }
                            </form>

                        </div>
                    </div>
                    <span></span>
                </div>
            </div>
        </div>
    );
};

export default PasswordCheck;
