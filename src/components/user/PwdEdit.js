import React, { useState } from "react";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    curpassword: "",
    newpassword: "",
    chkpassword: ""
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const { curpassword, newpassword, chkpassword } = formData;

    if (!curpassword || !newpassword || !chkpassword) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (newpassword !== chkpassword) {
      alert("새 비밀번호와 확인이 일치하지 않습니다.");
      return;
    }

    // 여기에 실제 비밀번호 변경 요청 API 호출 코드 작성
    console.log("비밀번호 변경 요청:", formData);
    alert("비밀번호가 변경되었습니다.");
  };

  return (
    <div className="info-right">
      <div class="user-info-title">
        <div class="info-title">
          <span>비밀번호</span>
          <span>변경</span>
        </div>
      </div>
      <div className="user-info-content">
        <span></span>
        <div className="password">
          <div className="password-edit info-edit">
            <p>새로운 비밀번호를 입력하세요</p><br />
            <input
              type="password"
              name="curpassword"
              placeholder="현재 비밀번호"
              value={formData.curpassword}
              onChange={handleInput}
            /><br />
            <input
              type="password"
              name="newpassword"
              placeholder="새 비밀번호"
              value={formData.newpassword}
              onChange={handleInput}
            /><br />
            <input
              type="password"
              name="chkpassword"
              placeholder="새 비밀번호 확인"
              value={formData.chkpassword}
              onChange={handleInput}
            /><br />
            <button className="btn-submit-password" onClick={handleSubmit}>확인</button>
          </div>
        </div>
        <span></span>
      </div>
    </div>
  );
}
