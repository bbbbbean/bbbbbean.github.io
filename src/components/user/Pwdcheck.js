import React, { useState } from "react";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";
import instance from "../../axios"

const PasswordCheck = ({ }) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");

    const handleConfirmClick = () => {
        instance.post("/api/auth/pwdCheck", { password })
            .then((response) => {
                console.log("실행됨");
                if (response.data.success) {
                    navigate("/user/mypage/edit", { state: { userDTO: response.data.userDTO } });
                } else {
                    alert("비밀번호가 일치하지 않습니다.");
                }
            })
            .catch((error) => {
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
