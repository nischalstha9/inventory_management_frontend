import axios from "axios";

const baseURL = "http://localhost:8000/api/v1/";
// const baseURL = "https://aakogako.herokuapp.com/api/v1/";
let axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});
if (typeof window !== "undefined") {
  const access_token = window.localStorage.getItem("access_token");
  if (access_token !== null) {
    axiosInstance = axios.create({
      baseURL: baseURL,
      timeout: 5000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `JWT ${access_token}`,
      },
    });
  }
  const refreshURL = baseURL + "auth/token/refresh/";

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      console.log(originalRequest);
      if (typeof error.response == undefined) {
        // alert("Session Expired Please Login Again.");
        // localStorage.removeItem("access_token");
        // window.location.pathname = "/logout";
        alert("A server/network error occoured.");
        return Promise.reject(error);
      }
      if (error.response.status === 400 && originalRequest.url === refreshURL) {
        alert("SESSION ENDED");
        window.location.pathname = "/auth/logout";
        return Promise.reject(error);
      }
      if (originalRequest.url !== refreshURL && error.response.status === 401) {
        return axiosInstance
          .post("auth/token/refresh/")
          .then((resp) => {
            console.log(resp);
            localStorage.setItem("access_token", resp.data.access);
            let new_token = localStorage.getItem("access_token");
            originalRequest.headers.Authorization = `JWT ${new_token}`;
            return axiosInstance(originalRequest);
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
}
export default axiosInstance;
