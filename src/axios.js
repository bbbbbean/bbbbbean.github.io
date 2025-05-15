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
    async (error) => {
        if (error.response.status != 401) {
            return error.response;
        }
        const { config } = error;
        if (error.response.data.message.includes("refresh")) {
            try {
                const response = await axios.post(
                    "/api/auth/reneToken",
                    {},
                    { withCredentials: true }
                );
                console.log(response);
                localStorage.setItem("accessToken", response.data.jwtToken);
                config.headers['Authorization'] = `Bearer ${response.data.jwtToken}`;
                return axios(config);
            } catch (e) {
                window.location.href = '/user/logout';
                return;
            }

        } else {
            window.location.href = '/user/logout';
            return;
        }
    }
);

export default instance;