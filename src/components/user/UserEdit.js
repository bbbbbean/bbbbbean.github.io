import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function MyInfo() {

    const [userDTO, setUserDTO] = useState(useLocation().state.userDTO);
    const [editField, setEditField] = useState(null);
    const [formData, setFormData] = useState({
        nickname: "",
        email: "",
        emailCode: "",
        phone: "",
        phoneCode: "",
        address: ""
    });

    console.log(userDTO);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const showEdit = (field) => setEditField(field);
    const hideEdit = (e) => {
        const btnClass = e.target.className.split(" ");
        axios.post("/api/user/update", { "userId": userDTO.userId, "value": formData[btnClass[0]], "authCode": formData[btnClass[1]], "type": btnClass[0] })
            .then((response) => {
                setUserDTO(response.data.userDTO);
                alert("수정되었습니다.");
            });
        setEditField(null);
    };

    return (
        <div className="info-right">
            <div className="user-info-title">
                <div className="info-title">
                    <span>내정보</span>
                    <span>관리</span>
                </div>
            </div>
            <div className="user-info-content">
                <span></span>
                <div className="userid">
                    <label>아이디</label>
                    <span>{userDTO.userId}</span>
                </div>
                <span></span>
                <div className="username">
                    <label>이름</label>
                    <span>{userDTO.name}</span>
                </div>
                <span></span>
                <div className="nickname">
                    <label>닉네임</label>
                    <span>{userDTO.nickName}</span>
                    {editField !== "nickname" ? (
                        <button className="btn-edit" onClick={() => showEdit("nickname")}>수정하기</button>
                    ) : (
                        <div className="info-edit">
                            <label></label>
                            <input
                                type="text"
                                name="nickname"
                                placeholder="새로운 닉네임을 입력해주세요."
                                value={formData.nickname}
                                onChange={handleInput}
                            />
                            <button className="nickname" onClick={hideEdit}>완료</button>
                        </div>
                    )}
                </div>
                <span></span>
                <div className="email">
                    <label>이메일</label>
                    <span>{userDTO.email}</span>
                    {editField !== "email" ? (
                        <button className="btn-edit" onClick={() => showEdit("email")}>수정하기</button>
                    ) : (
                        <div className="info-edit">
                            <label></label>
                            <input
                                type="text"
                                name="email"
                                placeholder="새로운 이메일을 입력해주세요."
                                value={formData.email}
                                onChange={handleInput}
                            /><br></br>
                            <label></label>
                            <input
                                type="text"
                                name="emailCode"
                                placeholder="인증코드 입력"
                                value={formData.emailCode}
                                onChange={handleInput}
                            />
                            <button className="btn-code-email">인증코드 전송</button>
                            <button className="email emailCode" onClick={hideEdit}>완료</button>
                        </div>
                    )}
                </div>
                <span></span>
                <div className="phone">
                    <label>연락처</label>
                    <span>{userDTO.phone}</span>
                    {editField !== "phone" ? (
                        <button className="btn-edit" onClick={() => showEdit("phone")}>수정하기</button>
                    ) : (
                        <div className="info-edit">
                            <label></label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="새로운 연락처를 입력해주세요."
                                value={formData.phone}
                                onChange={handleInput}
                            /><br></br>
                            <label></label>
                            <input
                                type="text"
                                name="phoneCode"
                                placeholder="인증코드 입력"
                                value={formData.phoneCode}
                                onChange={handleInput}
                            />
                            <button className="btn-code-phone">본인인증</button>
                            <button className="phone phoneCode" onClick={hideEdit}>완료</button>
                        </div>
                    )}
                </div>
                <span></span>
                <div className="address">
                    <label>내주소</label>
                    <span>{userDTO.address}</span>
                    {editField !== "address" ? (
                        <button className="btn-edit" onClick={() => showEdit("address")}>수정하기</button>
                    ) : (
                        <div className="info-edit">
                            <label></label>
                            <input
                                type="text"
                                name="address"
                                placeholder="새로운 주소를 입력해주세요."
                                value={formData.address}
                                onChange={handleInput}
                            />
                            <button className="address" onClick={hideEdit}>완료</button>
                        </div>
                    )}
                </div>
                <span></span>
            </div>
        </div>
    );
}
