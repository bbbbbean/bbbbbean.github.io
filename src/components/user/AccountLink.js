import { useEffect, useState } from "react";
import instance from "../../axios"

export default function AccountLink() {

    const [naverEmail, setNaverEmail] = useState("미연동");
    const [kakaoEmail, setKakaoEmail] = useState("미연동");
    const [googleEmail, setGoogleEmail] = useState("미연동");

    const [naverFail, setNaverFail] = useState("");
    const [kakaoFail, setKakaoFail] = useState("");
    const [googleFail, setGoogleFail] = useState("");

    useEffect(() => {

        let platform = "";
        let code = "";
        let failCode = "";
        new URL(window.location.href).search
            .substring(1).replace("?", "").split("&")
            .forEach((item) => {
                if (!item.indexOf("platform")) {
                    platform = item.split("=")[1];
                } else if (!item.indexOf("code")) {
                    code = item.split("=")[1];
                } else if (!item.indexOf("FailCode")) {
                    failCode = item.split("=")[1];
                }
            });

        switch (platform) {
            case "1": // 네이버
                break;
            case "2": // 카카오
                KakaoLinkApi(code)
                break;
            case "3": // 구글
                break;
        }

        switch (failCode) {
            case '1': // 네이버
                setNaverFail("이미 연결된 네이버 계정입니다.");
                break;
            case '2': // 카카오
                setKakaoFail("이미 연결된 카카오 계정입니다.");
                break;
            case '3': // 구글
                setGoogleFail("이미 연결된 구글 계정입니다.");
                break;
        }

        instance.post("/api/user/getAccountLink", { "userId": localStorage.getItem("userId") })
            .then((response) => {
                const socialLinkDTO = response.data.socialLinkDTO;
                socialLinkDTO.forEach((item) => {
                    const platform = item.platformType;
                    const email = item.email;
                    switch (platform) {
                        case '1': // 네이버
                            setNaverEmail(email);
                            break;
                        case '2': // 카카오
                            setKakaoEmail(email);
                            break;
                        case '3': // 구글
                            setGoogleEmail(email);
                            break;
                    }
                })
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleUnLink = (e) => {
        const platformType = e.target.className.split(" ")[0];
        instance.post("/api/auth/unLink", { userId: localStorage.getItem("userId"), platformType })
            .then((response) => {
                if (response.status == 200) {
                    switch (platformType) {
                        case '1': // 네이버
                            setNaverEmail("미연동");
                            break;
                        case '2': // 카카오
                            setKakaoEmail("미연동");
                            break;
                        case '3': // 구글
                            setGoogleEmail("미연동");
                            break;
                    }
                } else {
                    switch (platformType) {
                        case '1': // 네이버
                            setNaverFail("연동해제 실패");
                            break;
                        case '2': // 카카오
                            setKakaoFail("연동해제 실패");
                            break;
                        case '3': // 구글
                            setGoogleFail("연동해제 실패");
                            break;
                    }
                }
            });
    };

    const handleNaverLink = (item) => {
        console.log("네이버 계정 연결:", item);
    };

    const handleGoogleLink = (item) => {
        console.log("구글 계정 연결:", item);
    };

    const handleKakaoLink = () => {
        const REDIRECT_URI = "http://localhost:3000/mypage/account_link?platform=2";
        const CLIENT_ID = "";
        const RESPONSE_TYPE = "code";
        const url = "https://kauth.kakao.com/oauth/authorize" +
            "?client_id=" + CLIENT_ID +
            "&redirect_uri=" + REDIRECT_URI +
            "&response_type=" + RESPONSE_TYPE;
        console.log(url);

        window.location.href = url;
    };
    const KakaoLinkApi = (code) => {
        instance.post("/api/auth/kakaoLink", {
            "userId": localStorage.getItem("userId"),
            code,
            "url": window.location.href
        })
            .then((response) => {
                if (response.data.success) {
                    window.location.href = "/mypage/account_link"
                } else {
                    window.location.href = "/mypage/account_link?FailCode=" + response.data.FailCode;
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="info-right">
            <div className="user-info-title">
                <div className="info-title">
                    <span>계정</span>
                    <span>연동</span>
                </div>
            </div>
            <div className="user-info-content">
                <span></span>
                <div className="naver-link">
                    <label>네이버</label>
                    <span>{naverEmail}   </span>
                    <span>{naverFail}</span>
                    {naverEmail.indexOf("미연동") ?
                        <button className="1 btn-link" onClick={handleUnLink}>연결해제</button>
                        :
                        <button className="btn-edit-naver btn-link" onClick={handleNaverLink}>연결하기</button>
                    }

                </div>
                <span></span>
                <div className="kakao-link">
                    <label>카카오</label>
                    <span>{kakaoEmail}   </span>
                    <span>{kakaoFail}</span>
                    {kakaoEmail.indexOf("미연동") ?
                        <button className="2 btn-link" onClick={handleUnLink}>연결해제</button>
                        :
                        <button className="btn-edit-kakao btn-link" onClick={handleKakaoLink}>연결하기</button>
                    }

                </div>
                <span></span>
                <div className="google-link">
                    <label>구글</label>
                    <span>{googleEmail}   </span>
                    <span>{googleFail}</span>
                    {googleEmail.indexOf("미연동") ?
                        <button className="3 btn-link" onClick={handleUnLink}>연결해제</button>
                        :
                        <button className="btn-edit-google btn-link" onClick={handleGoogleLink}>연결하기</button>
                    }
                </div>
                <span></span>
            </div>
        </div >
    );
}
