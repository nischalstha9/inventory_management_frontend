import axios from "axios";
// import { log_out } from "./action";
// import { useDispatch } from "react-redux";

const baseURL = "http://localhost:8000/api/v1/";
// const baseURL = "https://aakogako.herokuapp.com/api/v1/";
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

const refreshURL = baseURL + "auth/token/refresh/";
const loginURL = baseURL + "auth/token/obtain/";

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (typeof error.response == undefined) {
      // alert("Session Expired Please Login Again.");
      // localStorage.removeItem("access_token");
      // window.location.pathname = "/logout";
      alert("A server/network error occoured.");
      return Promise.reject(error);
    }
    if (error.response.status === 400 && originalRequest.url === refreshURL) {
      window.location.pathname = "/auth/logout";
      return Promise.reject(error);
    }
    if (originalRequest.url !== refreshURL && error.response.status === 401) {
      return axiosInstance
        .post("auth/token/refresh/")
        .then((resp) => {
          localStorage.setItem("access_token", resp.data.access);
          return axiosInstance(originalRequest);
          // .then((resp) => {
          //   return resp;
          // })
          // .catch((err) => Promise.reject(err));
        })
        .catch((err) => {
          if (err.status === 400) {
            alert("Session Expired Please Login Again.");
            // localStorage.removeItem("access_token");
            window.location.pathname = "/logout";
          }
        });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
