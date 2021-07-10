import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { log_out, insert_user } from "../../redux/action";
import axiosInstance from "../../AxiosInstance";
import { Link } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    axiosInstance
      .post("auth/token/blacklist/")
      .then((resp) => {})
      .catch((err) => {})
      .finally(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        dispatch(log_out());
        dispatch(insert_user({}));
      });
  }, []);

  return (
    <div
      className="white-container"
      style={{ padding: "2vh 5vw", margin: "2vh" }}
    >
      <h1>You are Logged Out!</h1>
      <Link to="/login">Log in again?</Link>
      <hr />
      <img src="./logout.svg" alt="" srcset="" className="svg404" />
    </div>
  );
};

export default Logout;
