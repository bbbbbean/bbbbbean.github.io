import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:8100",
    timeout: 2000,
});

api.interceptors.request.use(
    (config) => {
        config.headers['Content-Type'] = 'application/json';
        config.withCredentials = true;
        return config;
    },
    (error) => {
        console.log("error : " + error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.log("토큰 재발행 실행");
        console.log(error.response.status);
        if (error.response.status != 401) {
            return error.response;
        }
        const { config } = error;
        if (error.response.data.message.includes("refresh")) {
            try {
                const response = await axios.post(
                    "http://localhost:8100/api/auth/reneToken",
                    {},
                    { withCredentials: true, headers: { 'refresh': 'refresh' } }
                );
                console.log("토큰 재발행 성공");
                return axios(config);
            } catch (e) {
                //window.location.href = '/user/logout';
                return;
            }

        } else {
            //window.location.href = '/user/logout';
            return;
        }
    }
);

export default api;