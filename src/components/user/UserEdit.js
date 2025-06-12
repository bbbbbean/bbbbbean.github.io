import { useEffect, useState } from "react";
import api from "../../axios"
import { setUserName } from "../../store";
import { useDispatch } from "react-redux";
import ChangeImage from "../modal/ChangeImageModal";
import PasswordCheck from "./Pwdcheck";

const UserEditForm = ({ profile, setProfile }) => {
    const dispatch = useDispatch();

    const [userDTO, setUserDTO] = useState({
        userId: localStorage.getItem("userId"),
        birthday: localStorage.getItem("birthday"),
        name: localStorage.getItem("name"),
        nickName: localStorage.getItem("nickName"),
        isPrivate: localStorage.getItem("isPrivate") === "1",
        gender: localStorage.getItem("gender"),
        address: localStorage.getItem("address"),
        phone: localStorage.getItem("phone"),
        introduction: localStorage.getItem("introduction")
    });

    const [editField, setEditField] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [formData, setFormData] = useState({
        nickname: userDTO.nickName,
        phone: userDTO.phone,
        address: userDTO.address,
        introduction: userDTO.introduction,
        isPrivate: userDTO.isPrivate ? "1" : "0"
    });

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            isPrivate: userDTO.isPrivate ? "1" : "0"
        }));
    }, [userDTO]);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrorMessage("");
    };

    const showEdit = (field) => setEditField(field);

    const hideEdit = (e) => {
        const type = e.target.className.split(" ")[0];
        const value = formData[type];

        api.post("/api/user/infoUpdate", { value, type })
            .then((response) => {
                if (response.status !== 200) {
                    setErrorMessage(response.data.error);
                    return;
                }

                const { userDTO: updated } = response.data;

                dispatch(setUserName(updated.nickName));

                setUserDTO({
                    ...updated,
                    isPrivate: updated.private ? "1" : "0"
                });

                console.log("aaaaa : " + updated.private);

                localStorage.setItem("nickName", updated.nickName);
                localStorage.setItem("introduction", updated.introduction);
                localStorage.setItem("address", updated.address);
                localStorage.setItem("isPrivate", updated.private ? "true" : "false");
            });

        setEditField(null);
    };

    const [showModal, setShowModal] = useState(false);
    const handleImage = () => setShowModal(!showModal);

    useEffect(() => {
        setShowModal(false);
    }, [profile]);

    return (
        <div className="info-right">
            {showModal && <ChangeImage setProfile={setProfile} setShowModal={setShowModal} />}
            <div className="user-info-title">
                <div className="info-title">
                    <span>내정보</span>
                    <span>관리</span>
                </div>
            </div>
            <span></span>
            <div className="user-info-content">
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
                <div className="gender">
                    <label>성별</label>
                    <span>{userDTO.gender === "male" ? "남자" : "여자"}</span>
                </div>
                <span></span>
                <div className="birthday">
                    <label>생일</label>
                    <span>{userDTO.birthday}</span>
                </div>
                <span></span>
                <div className="phone">
                    <label>연락처</label>
                    <span>{userDTO.phone}</span>
                </div>
                <span></span>
                <div className="profile">
                    <label>이미지</label>
                    <img src={profile} style={{ maxWidth: "50px", maxHeight: "50px", borderRadius: "50%" }} alt="프로필" />
                    <button className="profile my-page-btn" onClick={handleImage}>이미지 변경</button>
                </div>
                <span></span>
                <div className="introduction">
                    <label>소개</label>
                    <div>{userDTO.introduction}</div>
                    {editField !== "introduction" ? (
                        <button className="btn-edit my-page-btn" onClick={() => showEdit("introduction")}>수정하기</button>
                    ) : (
                        <div className="info-edit">
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
                            <button className="introduction my-page-btn" onClick={hideEdit}>완료</button>
                        </div>
                    )}
                </div>
                <span></span>
                <div className="nickname">
                    <label>닉네임</label>
                    <span>{userDTO.nickName}</span>
                    {editField !== "nickname" ? (
                        <button className="btn-edit my-page-btn" onClick={() => showEdit("nickname")}>수정하기</button>
                    ) : (
                        <div className="info-edit">
                            <input
                                type="text"
                                name="nickname"
                                placeholder="새로운 닉네임을 입력해주세요."
                                value={formData.nickname}
                                onChange={handleInput}
                            />
                            <button className="nickname my-page-btn" onClick={hideEdit}>완료</button>
                        </div>
                    )}
                </div>
                <span></span>
                <div className="address">
                    <label>활동지역</label>
                    <span>{userDTO.address}</span>
                    {editField !== "address" ? (
                        <button className="btn-edit my-page-btn" onClick={() => showEdit("address")}>수정하기</button>
                    ) : (
                        <div className="info-edit">
                            <select name="address" value={formData.address} onChange={handleInput}>
                                <option value="">선택하세요</option>
                                <option value="서울">서울</option>
                                <option value="부산">부산</option>
                                <option value="대구">대구</option>
                                <option value="인천">인천</option>
                                <option value="광주">광주</option>
                                <option value="대전">대전</option>
                                <option value="울산">울산</option>
                                <option value="세종">세종</option>
                                <option value="경기">경기</option>
                                <option value="강원">강원</option>
                                <option value="충북">충북</option>
                                <option value="충남">충남</option>
                                <option value="전북">전북</option>
                                <option value="전남">전남</option>
                                <option value="경북">경북</option>
                                <option value="경남">경남</option>
                                <option value="제주">제주</option>
                            </select>
                            <button className="address my-page-btn" onClick={hideEdit}>완료</button>
                        </div>
                    )}
                </div>
                <span></span>
                <div className="isPrivate">
                    <label>프로필 공개</label>
                    <span>{userDTO.isPrivate === "1" ? "공개" : "비공개"}</span>
                    {editField !== "isPrivate" ? (
                        <button className="btn-edit my-page-btn" onClick={() => showEdit("isPrivate")}>수정하기</button>
                    ) : (
                        <div className="info-edit">
                            <label className={formData.isPrivate === "1" ? "select" : "noselect"} htmlFor="pro-true">공개</label>
                            <input id="pro-true" type="radio" name="isPrivate" value="1" onChange={handleInput} />
                            <label className={formData.isPrivate === "0" ? "select" : "noselect"} htmlFor="pro-false">비공개</label>
                            <input id="pro-false" type="radio" name="isPrivate" value="0" onChange={handleInput} />
                            <button className="isPrivate my-page-btn" onClick={hideEdit}>완료</button>
                        </div>
                    )}
                </div>
                <span></span>
                <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>
            </div>
        </div>
    );
};

const UserEdit = ({ profile, setProfile }) => {
    const [password, setPassword] = useState("");
    const [ok, setOk] = useState(false);

    return ok
        ? <UserEditForm profile={profile} setProfile={setProfile} />
        : <PasswordCheck password={password} setPassword={setPassword} setOk={setOk} />;
};

export default UserEdit;
