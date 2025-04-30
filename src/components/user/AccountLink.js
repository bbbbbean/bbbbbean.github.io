import React, { useState } from "react";

export default function AccountLink() {
    const [showGoogleForm, setShowGoogleForm] = useState(false);
    const [showKakaoForm, setShowKakaoForm] = useState(false);

    const [googleInfo, setGoogleInfo] = useState({ account: "", code: "" });
    const [kakaoInfo, setKakaoInfo] = useState({ account: "", code: "" });

    const handleGoogleSubmit = () => {
        console.log("구글 계정 연결:", googleInfo);
    };

    const handleKakaoSubmit = () => {
        console.log("카카오 계정 연결:", kakaoInfo);
    };

    return (
        <div className="info-right">
            <div class="user-info-title">
                <div class="info-title">
                    <span>계정</span>
                    <span>연동</span>
                </div>
            </div>
            <div className="user-info-content">
                <span></span>
                <div className="naver-link">
                    <label>네이버</label>
                    <span>admin@naver.com</span>
                    <button className="btn-edit-naver btn-link">연결해제</button>
                </div>
                <span></span>
                <div className="google-link">
                    <label>구글</label>
                    <span>미연동</span>
                    <button className="btn-edit-google btn-link" onClick={() => setShowGoogleForm(true)}>연결하기</button>
                    {showGoogleForm && (
                        <div className="google-edit info-edit">
                            <label></label>
                            <input
                                type="text"
                                name="google"
                                placeholder="연결할 구글계정을 입력해주세요."
                                value={googleInfo.account}
                                onChange={(e) => setGoogleInfo({ ...googleInfo, account: e.target.value })}
                            />
                            <button className="btn-submit-google" onClick={handleGoogleSubmit}>완료</button>
                            <div className="info-edit">
                                <label></label>
                                <input
                                    type="text"
                                    name="google-code"
                                    placeholder="인증코드 입력"
                                    value={googleInfo.code}
                                    onChange={(e) => setGoogleInfo({ ...googleInfo, code: e.target.value })}
                                />
                                <button className="btn-code-google">인증코드 전송</button>
                            </div>
                        </div>
                    )}
                </div>
                <span></span>
                <div className="kakao-link">
                    <label>카카오</label>
                    <span>미연동</span>
                    <button className="btn-edit-kakao btn-link" onClick={() => setShowKakaoForm(true)}>연결하기</button>
                    {showKakaoForm && (
                        <div className="kakao-edit info-edit">
                            <label></label>
                            <input
                                type="text"
                                name="kakao"
                                placeholder="연결할 카카오계정 입력해주세요."
                                value={kakaoInfo.account}
                                onChange={(e) => setKakaoInfo({ ...kakaoInfo, account: e.target.value })}
                            />
                            <button className="btn-submit-kakao" onClick={handleKakaoSubmit}>완료</button>
                            <div className="info-edit">
                                <label></label>
                                <input
                                    type="text"
                                    name="kakao-code"
                                    placeholder="인증코드 입력"
                                    value={kakaoInfo.code}
                                    onChange={(e) => setKakaoInfo({ ...kakaoInfo, code: e.target.value })}
                                />
                                <button className="btn-code-kakao">인증코드 전송</button>
                            </div>
                        </div>
                    )}
                </div>
                <span></span>
            </div>
        </div>
    );
}
