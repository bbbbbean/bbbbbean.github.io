import axios from "axios";


const api = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
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
        if (!error.response) {
            return Promise.resolve({ data: null, status: 500, message: error.message });
        }
        if (error.response.status != 401) {
            return error.response;
        }
        const { config } = error;
        if (error.response.data.message && error.response.data.message.includes("refresh")) {
            try {
                await axios.post(
                    `${process.env.REACT_APP_SERVER_URL}/api/auth/reneToken`,
                    {},
                    { withCredentials: true, headers: { 'refresh': 'refresh' } }
                );
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

export default api;