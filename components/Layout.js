import Head from "next/head";
// import styles from "../styles/Layout.module.css";
import Footer from "./Footer";
import Header from "./Header";
import { useDispatch } from "react-redux";
import AxiosInstance from "../AxiosInstance";
import { insert_user, log_in } from "../redux/action";
import { useEffect } from "react";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = window.localStorage.getItem("access_token");
    if (token !== undefined) {
      AxiosInstance.get("auth/customer/")
        .then((resp) => {
          dispatch(insert_user(resp.data));
          dispatch(log_in());
        })
        .catch((err) => console.log(err));
    }
  }, []);
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        />
      </Head>
      <Header />
      <div>
        <main>{children}</main>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Layout;
