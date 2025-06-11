import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function TokenCheck() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.hash.substring(1));
    const accessToken = params.get("access_token");
    const idToken = params.get("id_token");

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }

    if (idToken) {
      localStorage.setItem("idToken", idToken);
    }

    if (accessToken || idToken) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

  return null;
}

export default TokenCheck;
