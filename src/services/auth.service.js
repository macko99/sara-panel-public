import axios from "axios";
import TokenService from "./token.service";
import api from "./api";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_SERVER;

const login = (username, password) => {

  let loginString = String(username + ':' + password);
  let loginData = encodeURI(loginString);
  let base64LoginString = btoa(loginData);

  return api
      .post("login?admin_required=true", {}, {
          headers: {
        Authorization: 'Basic ' + base64LoginString
      }
    })
    .then((response) => {
      if (response.data.access_token) {
          TokenService.setUser(response.data);
      }

      return response.data;
    });
};

const logout = () => {
    TokenService.removeUser();
    localStorage.removeItem("username");

    indexedDB.deleteDatabase('ResourcesDB')

    axios.delete(API_URL+ 'logout', {headers: authHeader()})
      .then((response) => {
            if (response.status >= 200 && response.status <= 299){
                console.log('logout successful');
            } else if (response.status === 401){
                console.log('logout successful');
            }
            },
            (error) => {
                const resMessage =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();

                if(!resMessage.includes('401'))
                    alert("Błąd: " + resMessage)
            }
      );
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getCurrentUsername = () => {
    return localStorage.getItem("username");
}



export default {
  login,
  logout,
  getCurrentUser,
    getCurrentUsername
};
