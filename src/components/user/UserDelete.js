import React, { useState } from "react";

export default function DeleteAccount() {
    const [password, setPassword] = useState("");

    const handleDelete = () => {
        if (!password) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        // 여기에 실제 탈퇴 요청 API 호출
        console.log("탈퇴 요청 비밀번호:", password);

        // 예시: 탈퇴 요청 처리
        alert("탈퇴 요청이 접수되었습니다.");
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
                        <p>탈퇴 시 n개월간 같은 명의로 가입이 불가합니다.</p><br />
                        <p>회원탈퇴를 원하시면 비밀번호를 입력하세요</p><br />
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        /><br />
                        <button className="btn-submit-password" onClick={handleDelete}>
                            확인
                        </button>
                    </div>
                </div>
                <span></span>
            </div>
        </div>
    );
}
