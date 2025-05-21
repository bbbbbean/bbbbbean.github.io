import { useEffect } from "react"
import instance from "./axios"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "./store"


const SuccessLogin = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = new URL(window.location.href).search.split("=")[1];
    localStorage.setItem("isAuth", true);
    instance.post("/api/auth/oAuthLogin", { userId })
      .then((response) => {
        const {
          userId,
          birthday,
          name,
          nickName,
          points,
          manner,
          gender,
          phone,
          address,
          introduction,
          profile,
        } = response.data.userDTO;

        localStorage.setItem("userId", userId);
        localStorage.setItem("birthday", birthday);
        localStorage.setItem("name", name);
        localStorage.setItem("nickName", nickName);
        localStorage.setItem("points", points);
        localStorage.setItem("manner", manner);
        localStorage.setItem("gender", gender);
        localStorage.setItem("phone", phone);
        localStorage.setItem("address", address);
        localStorage.setItem("introduction", introduction);
        localStorage.setItem("profile", profile);
        localStorage.setItem("loginPlatform", 2);

        dispatch(login());

        navigate("/");
      });
  })

  return (
    <>
    </>
  );
}

export default SuccessLogin;