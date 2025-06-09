import axios from "axios";

const postImageApi = axios.create({
  baseURL: "http://localhost:8100",
  timeout: 2000,
});

postImageApi.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      if (!config.headers["Content-Type"]) {
        // 이미 Content-Type이 설정되어 있지 않은 경우에만
        config.headers["Content-Type"] = "application/json";
      }
    }
    config.withCredentials = true;
    return config;
  },
  (error) => {
    console.error("요청 인터셉터 오류: " + error);
    return Promise.reject(error);
  }
);

postImageApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("토큰 재발행 실행");

    if (!error.response) {
      console.error("네트워크 오류 또는 응답이 없습니다.");
      return Promise.reject(error); // 응답 자체가 없는 경우 오류를 그대로 전달
    }
    console.log(error.response.status);
    if (error.response.status !== 401) {
      return error.response;
    }
    const { config } = error;
    if (error.response.data.message.includes("refresh")) {
      try {
        const response = await axios.post(
          "http://localhost:8100/api/auth/reneToken",
          {},
          { withCredentials: true, headers: { refresh: "refresh" } }
        );
        console.log("토큰 재발생 성공");
        return axios(config);
      } catch (e) {
        window.location.href = "/user/logout";
        return;
      }
    } else {
      window.location.href = "/user/logout";
      return;
    }
  }
);

export default postImageApi;
