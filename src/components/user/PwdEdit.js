import { useState } from "react";
import instance from "../../axios"

export default function ChangePassword() {
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
    let reg1 = /^(?=.*[a-zA-Z]).+$/
    let reg2 = /^(?=.*[!@#$%^*+=-]).+$/
    let reg3 = /^(?=.*[0-9]).+$/
    let reg4 = /^(?=.{8,15}).+$/

    const { curpassword, newpassword, chkpassword } = formData;
    if (!reg1.test(newpassword)) {
      setPwError("비밀번호는 영어가 포함되어야합니다.")
      return;
    } else if (!reg2.test(newpassword)) {
      setPwError("비밀번호는 특수문자가 포함되어야합니다.")
      return;
    } else if (!reg3.test(newpassword)) {
      setPwError("비밀번호는 숫자가 포함되어야합니다.")
      return;
    } else if (!reg4.test(newpassword)) {
      setPwError("비밀번호는 8~15글자 사이어야합니다.")
      return;
    }
    instance.post("/api/user/passwordUpdate", { "userId": localStorage.getItem("userId"), curpassword, newpassword, chkpassword })
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
          let target = "";
          switch (response.data.code) {
            case "1":
              setPwError("사용중인 비밀번호가 일치하지 않습니다.");
              target = document.getElementById("curpassword");
              formData.curpassword = "";
              target.value = "";
              target.focus();
              break;
            case "2":
              setPwError("새로운 비밀번호와 확인이 일치하지 않습니다.");
              target = document.getElementById("chkpassword");
              formData.chkpassword = "";
              target.value = "";
              target.focus();
              handleInput(target);
            case "3":
              setPwError("이미 사용중인 비밀번호입니다.");
              target = document.getElementById("chkpassword")
              formData.chkpassword = "";
              target.value = "";
              target = document.getElementById("newpassword");
              formData.newpassword = "";
              target.value = "";
              target.focus();
              handleInput(target);
              break;
            case "4":
              setPwError("비밀번호 변경에 실패했습니다. 다시 입력해주세요.");
              target = document.getElementById("chkpassword")
              formData.chkpassword = "";
              target.value = "";
              target = document.getElementById("newpassword");
              formData.newpassword = "";
              target.value = "";
              target = document.getElementById("curpassword");
              formData.curpassword = "";
              target.value = "";
              target.focus();
              handleInput(target);
              break;
          }
        }
      })
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
              {(formData.curpassword.length >= 4 && formData.newpassword.length >= 8 && formData.chkpassword.length >= 8) ?
                <button className="btn-submit-password" type="submit">
                  변경
                </button>
                :
                <button className="btn-submit-password" type="button" style={{ backgroundColor: '#666666' }}>
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
