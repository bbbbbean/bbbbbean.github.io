import { useState } from "react";
import api from "../../axios"

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    curpassword: "",
    newpassword: "",
    chkpassword: ""
  });

  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setPwError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { curpassword, newpassword, chkpassword } = formData;

    api.post("/api/user/passwordUpdate", { curpassword, newpassword, chkpassword })
      .then((response) => {
        if (response.status == 200) {
          setPwSuccess("비밀번호 변경 성공");
          formData.curpassword = "";
          formData.newpassword = "";
          formData.chkpassword = "";
          document.querySelectorAll("input").forEach((item) => {
            item.value = "";
          });
        } else {

          setPwError(response.data.error);
          let target = null;
          switch (response.data.code) {
            case "1":
              target = document.getElementById("curpassword");
              formData.curpassword = "";
              if (target && "value" in target) (target).value = "";
              if (target && "focus" in target) (target).focus();
              break;
            case "2":
              target = document.getElementById("chkpassword");
              formData.chkpassword = "";
              if (target && "value" in target) (target).value = "";
              if (target && "focus" in target) (target).focus();
              break;
            case "3":
              target = document.getElementById("chkpassword");
              formData.chkpassword = "";
              if (target && "value" in target) (target).value = "";
              target = document.getElementById("newpassword");
              formData.newpassword = "";
              if (target && "value" in target) (target).value = "";
              if (target && "focus" in target) (target).focus();
              break;
            default:
              break;
          }
        }
      })
  };

  return (
    <div className="info-right">
      <div className="user-info-title">
        <div className="info-title">
          <span>비밀번호</span>
          <span>변경</span>
        </div>
      </div>
      <div className="user-info-content">
        <span></span>
        <div className="password">
          <div className="password-edit">
            <p>새로운 비밀번호를 입력하세요</p>
            {(!pwError && !pwSuccess) && <br />}<p style={{ color: "#dd3e3e", fontWeight: "bold" }}>{pwError}{pwSuccess}</p>
            <form onSubmit={handleSubmit}>
              <input
                id="curpassword"
                type="password"
                name="curpassword"
                placeholder="현재 비밀번호"
                value={formData.curpassword}
                onChange={(e) => {
                  if (e.target.value.length > 15) {
                    e.target.value = e.target.value.substring(0, 15);
                  }
                  handleInput(e);
                }
                }
              /><br />
              <input
                id="newpassword"
                type="password"
                name="newpassword"
                placeholder="새 비밀번호"
                value={formData.newpassword}
                onChange={(e) => {
                  if (e.target.value.length > 15) {
                    e.target.value = e.target.value.substring(0, 15);
                  }
                  handleInput(e);
                }
                }
              /><br />
              <input
                id="chkpassword"
                type="password"
                name="chkpassword"
                placeholder="새 비밀번호 확인"
                value={formData.chkpassword}
                onChange={(e) => {
                  if (e.target.value.length > 15) {
                    e.target.value = e.target.value.substring(0, 15);
                  }
                  handleInput(e);
                }
                }
              /><br />
              {(formData.curpassword.length >= 4 && formData.newpassword.length >= 4 && formData.chkpassword.length >= 4) ?
                <button className="btn-submit-password my-page-btn" type="submit">
                  변경
                </button>
                :
                <button className="btn-submit-password my-page-btn" type="button" style={{ backgroundColor: '#666666' }}>
                  변경
                </button>
              }
            </form>
          </div>
        </div>
        <span></span>
      </div>
    </div>
  );
}

export default ChangePassword
