import React, { useState } from "react";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";

const PasswordCheck = ({ }) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");

    const handleConfirmClick = () => {
        console.log("accessToken : " + window.localStorage.getItem('accessToken'));
        axios.post("/api/auth/pwdCheck", { password },
            {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`
                }
            }
        )
            .then((response) => {
                console.log(response.data);
                if (response.data.success) {
                    navigate("/user/mypage/edit", { state: { userDTO: response.data.userDTO } });
                } else {
                    alert("비밀번호가 일치하지 않습니다.");
                }
            })
            .catch((error) => {
                console.error("type : ", error.response.data.type);
                console.error("message : ", error.response.data.message);
                if(error.response.data.message.includes("만료")){
                    console.log("토큰 재발급 코드 실행");
                } else {
                    navigate("/user/login");
                }
            });
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
                            <br />
                            <input
                                type="password"
                                name="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <br />
                            <button className="btn-submit-password" onClick={handleConfirmClick}>
                                확인
                            </button>
                        </div>
                    </div>
                    <span></span>
                </div>
            </div>
        </div>
    );
};

export default PasswordCheck;
