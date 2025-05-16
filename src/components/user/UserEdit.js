import { useEffect, useState } from "react";
import instance from "../../axios"
import { setUserName } from "../../store";
import { useDispatch } from "react-redux";

const UserEdit = () => {

    const dispatch = useDispatch();

    const [userDTO, setUserDTO] = useState({
        userId: localStorage.getItem("userId"),
        email: localStorage.getItem("email"),
        name: localStorage.getItem("name"),
        nickName: localStorage.getItem("nickName"),
        private: localStorage.getItem("isPrivate"),
        gender: localStorage.getItem("gender"),
        address: localStorage.getItem("address"),
        phone: localStorage.getItem("phone"),
        introduction: localStorage.getItem("introduction")
    });

    const [editField, setEditField] = useState(null);

    let privateV = "";

    const [formData, setFormData] = useState({
        nickname: "",
        email: "",
        emailCode: "",
        phone: "",
        phoneCode: "",
        address: "",
        introduction: userDTO.introduction,
        gender: userDTO.gender,
        isPrivate: ""
    });

    useEffect(() => {
        privateV = userDTO.private ? "1" : "0";
        setFormData(prev => ({ ...prev, ["isPrivate"]: privateV }));
    }, [userDTO])

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const showEdit = (field) => setEditField(field);
    const hideEdit = (e) => {
        const btnClass = e.target.className.split(" ");
        console.log(btnClass[0]);
        instance.post("/api/user/infoUpdate", { "userId": userDTO.userId, "value": formData[btnClass[0]], "authCode": formData[btnClass[1]], "type": btnClass[0] })
            .then((response) => {
                if (btnClass[0] === "nickname") {
                    dispatch(setUserName(response.data.userDTO.nickName));
                }
                setUserDTO(response.data.userDTO);
                const {
                    userId,
                    email,
                    name,
                    nickName,
                    points,
                    isPrivate,
                    manner,
                    gender,
                    introduction,
                } = response.data.userDTO;

                localStorage.setItem("userId", userId);
                localStorage.setItem("email", email);
                localStorage.setItem("name", name);
                localStorage.setItem("nickName", nickName);
                localStorage.setItem("points", points);
                localStorage.setItem("isPrivate", isPrivate);
                localStorage.setItem("manner", manner);
                localStorage.setItem("gender", gender);
                localStorage.setItem("introduction", introduction);
                localStorage.setItem("loginPlatform", 0);
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
                <div className="introduction">
                    <label>소개</label>
                    <span>{userDTO.introduction}</span>
                    {editField !== "introduction" ? (
                        <button className="btn-edit" onClick={() => showEdit("introduction")}>수정하기</button>
                    ) : (
                        <div className="info-edit">
                            <label></label>
                            <textarea
                                name="introduction"
                                placeholder="자기소개 입력"
                                value={formData.introduction}
                                onChange={(e) => {
                                    if (e.target.value.length > 100) {
                                        e.target.value = e.target.value.substring(0, 100);
                                    }
                                    handleInput(e);
                                }}
                            />
                            <button className="introduction" onClick={hideEdit}>완료</button>
                        </div>
                    )}
                </div>
                <span></span>
                <div className="gender">
                    <label>성별</label>
                    <span>{userDTO.gender === "1" ? "남자" : "여자"}</span>
                    {editField !== "gender" ? (
                        <button className="btn-edit" onClick={() => showEdit("gender")}>수정하기</button>
                    ) : (
                        <div className="info-edit">
                            <label></label>
                            <label className={formData.gender === "1" ? "select" : "noselect"} htmlFor="man">
                                남자
                            </label>
                            <input
                                id="man"
                                type="radio"
                                name="gender"
                                value="1"
                                onChange={handleInput}
                            />
                            <label className={formData.gender === "2" ? "select" : "noselect"} htmlFor="woman">여자</label>
                            <input
                                id="woman"
                                type="radio"
                                name="gender"
                                value="2"
                                onChange={handleInput}
                            />
                            <button className="gender" onClick={hideEdit}>완료</button>
                        </div>
                    )}
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
                <div className="isPrivate">
                    <label>프로필 공개</label>
                    <span>{userDTO.private ? "공개" : "비공개"}</span>
                    {editField !== "isPrivate" ? (
                        <button className="btn-edit" onClick={() => showEdit("isPrivate")}>수정하기</button>
                    ) : (
                        <div className="info-edit">
                            <label></label>
                            <label className={formData.isPrivate === "1" ? "select" : "noselect"} htmlFor="pro-true">
                                공개
                            </label>
                            <input
                                id="pro-true"
                                type="radio"
                                name="isPrivate"
                                value="1"
                                onChange={handleInput}
                            />
                            <label className={formData.isPrivate === "0" ? "select" : "noselect"} htmlFor="pro-false">비공개</label>
                            <input
                                id="pro-false"
                                type="radio"
                                name="isPrivate"
                                value="0"
                                onChange={handleInput}
                            />
                            <button className="isPrivate" onClick={hideEdit}>완료</button>
                        </div>
                    )}
                </div>
                <span></span>
            </div>
        </div>
    );
}


export default UserEdit;
