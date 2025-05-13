import axios from "axios";

const Kakao = () => {

    const REDIRECT_URI = "http://localhost:3000/user/kakaoCode";
    const CLIENT_ID = "";
    const RESPONSE_TYPE = "code";
    const url = "https://kauth.kakao.com/oauth/authorize" +
                "?client_id="+ CLIENT_ID +
                "&redirect_uri="+ REDIRECT_URI +
                "&response_type="+ RESPONSE_TYPE;
    console.log(url);

    window.location.href = url;
};

export default Kakao;
