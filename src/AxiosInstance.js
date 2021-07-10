import axios from "axios";

const baseURL = "http://localhost:8000/api/v1/";
// const baseURL = "https://aakogako.herokuapp.com/api/v1/";
const AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

const refreshURL = baseURL + "auth/token/refresh/";

// Add a request interceptor
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = "JWT " + token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

//Add a response interceptor

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401 && originalRequest.url === refreshURL) {
      window.location.pathname = "/logout";
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      return AxiosInstance.post("auth/token/refresh/").then((res) => {
        if (res.status === 200) {
          let new_token = res.data.access;
          localStorage.setItem("access_token", new_token);
          originalRequest.headers["Authorization"] = new_token;
          return AxiosInstance(originalRequest);
        }
      });
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
