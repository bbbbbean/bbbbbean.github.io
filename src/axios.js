import axios from "axios";


const instance = axios.create({
    timeout: 2000,
});

instance.interceptors.request.use(
    (config) => {
        const accessToken = window.localStorage.getItem('accessToken');
        config.headers['Content-Type'] = 'application/json';
        config.headers['Authorization'] = `Bearer ${accessToken}`;

        return config;
    },
    (error) => {
        console.log("error : " + error);
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const {
            config,
        } = error;
        if (error.response.data.message.includes("refresh")) {
            const originalRequest = config;
            axios.post("/api/auth/reneToken",
                {},
                { withCredentials: true })
                .then(async (response) => {
                    localStorage.setItem("accessToken", response.data.jwtToken);
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.jwtToken}`;
                    alert("reissue Token");
                })
                .catch((error) => {
                    window.location.href = '/user/login';
                    return;
                });
        } else {
            window.location.href = '/user/login';
                    return;
        }
    }
);

export default instance;