import axios from "axios";
import TokenService from "./token.service";

const SERVER_URL = process.env.REACT_APP_SERVER;

const instance = axios.create({
    baseURL: SERVER_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = TokenService.getLocalAccessToken();
        if (token) {
            config.headers["Authorization"] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;
        if (originalConfig.url !== "login?admin_required=true" && err.response) {
            // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const rs = await axios.post(SERVER_URL + "refresh", {},{
                        headers: { Authorization: 'Bearer ' + TokenService.getLocalRefreshToken() } ,
                    });

                    const newAccessToken = rs.data.access_token;
                    const newRefreshToken = rs.data.refresh_token;

                    TokenService.updateLocalBothTokens(newAccessToken, newRefreshToken);

                    return instance(originalConfig);

                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }
        return Promise.reject(err);
    }
);

export default instance;