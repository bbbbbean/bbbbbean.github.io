import { useEffect } from "react"
import instance from "./axios"


const SuccessLogin = () => {

  useEffect(() => {
    const token = new URL(window.location.href).search.split("=")[1];
    localStorage.setItem("accessToken", token);
    localStorage.setItem("isAuth",true);
    instance.post()
    window.location.href = "/"
  })

  return (
    <>
    </>
  );
}

export default SuccessLogin;