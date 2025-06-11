import { useEffect } from "react"
import instance from "./axios"
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "./store"


const SuccessLogin = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { platform } = useParams();

  useEffect(() => {
    localStorage.setItem("isAuth", true);
    instance.post("/api/auth/oAuthLogin")
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
          private:isPrivate,
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
        localStorage.setItem("isPrivate", isPrivate);
        localStorage.setItem("introduction", introduction);
        localStorage.setItem("profile", profile);
        localStorage.setItem("loginPlatform", platform);

        dispatch(login());

        navigate("/");
      })
      .catch((error) => {
        navigate("/user/logout");
      });
  })

  return (
    <>
    </>
  );
}

export default SuccessLogin;