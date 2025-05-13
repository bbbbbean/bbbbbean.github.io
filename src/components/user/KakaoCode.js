import { useNavigate } from "react-router-dom";
import "../../css/user_css/login.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../store"


const KakaoCode = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const url = new URL(window.location.href);
    const code = url.search.substring(6)

    axios.post("/api/auth/kakao", { code })
            .then((response) => {
            localStorage.setItem("accessToken", response.data.jwtToken);
            localStorage.setItem("isAuth", true);

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

            dispatch(login());

            navigate("/");
        }).catch((error) => {
            navigate("/user/login");
        });
};

export default KakaoCode;
