const getLocalRefreshToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.refresh_token;
};

const getLocalAccessToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.access_token;
};

const updateLocalAccessToken = (token) => {
    let user = JSON.parse(localStorage.getItem("user"));
    user.access_token = token;
    localStorage.setItem("user", JSON.stringify(user));
};

const updateLocalBothTokens = (access_token, refresh_token) => {
    let user = JSON.parse(localStorage.getItem("user"));
    user.access_token = access_token;
    user.refresh_token = refresh_token;
    localStorage.setItem("user", JSON.stringify(user));
};

const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const setUser = (user) => {
    console.log(JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
};

const removeUser = () => {
    localStorage.removeItem("user");
};

const TokenService = {
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalAccessToken,
    updateLocalBothTokens,
    getUser,
    setUser,
    removeUser,
};

export default TokenService;