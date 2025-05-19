import { useState } from "react";
import instance from "../../axios";

export default function DeleteAccount() {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [form, setForm] = useState(true);

    const handlePwCheck = (e) => {
        e.preventDefault();
        instance.post("/api/user/myInfoPwdCheck", { "userId": localStorage.getItem("userId"), password })
            .then((response) => {
                console.log("실행됨");
                console.log(response);
                if (response.data.success) {
                    setForm(false);
                } else {
                    setPassword("")
                    setMessage(response.data.message);
                    document.getElementById('password').focus();
                }
            })
    };

    const handleRemove = (e) => {
        e.preventDefault();
        instance.post("/api/auth/remove", { "userId": localStorage.getItem("userId")})
            .then((response) => {
                window.location.href = '/user/logout';
            })
    };

    return (
        <div className="info-right">
            <div className="user-info-title">
                <div className="info-title">
                    <span>회원</span>
                    <span>탈퇴</span>
                </div>
            </div>
            <div className="user-info-content">
                <span></span>
                <div className="delete-account">
                    <div className="delete-account-remove info-edit">
                        <h2>회원 탈퇴</h2>
                        <p>ID : admin</p><br />
                        {form ? <p>회원탈퇴를 원하시면 비밀번호를 입력하세요</p> : <p style={{ color: '#dd3e3e', fontWeight: "bold" }}>탈퇴 시 n개월간 같은 명의로 가입이 불가합니다.</p>}<br />
                        <span style={{ color: '#dd3e3e', fontWeight: "bold" }}>{message}</span>
                        {form ? <form onSubmit={handlePwCheck}>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setMessage("");
                                }}
                            /><br />
                            {(password.length >= 4) ?
                                <button className="btn-submit-password my-page-btn" type="submit">
                                    확인
                                </button>
                                :
                                <button className="btn-submit-password my-page-btn" type="button" style={{ backgroundColor: '#666666' }}>
                                    확인
                                </button>
                            }
                        </form>
                            :
                            <button className="my-page-btn" type="button" style={{ backgroundColor: "#dd3e3e" }} onClick={handleRemove}>
                                탈퇴하기
                            </button>
                        }

                    </div>
                </div>
                <span></span>
            </div>
        </div>
    );
}
