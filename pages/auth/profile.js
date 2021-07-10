import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import AxiosInstance from "../../AxiosInstance";

const MyAccount = ({ user }) => {
  // const router = useRouter();
  // if (!authenticated) {
  //   router.push("/auth/login");
  // }
  return (
    <div className="container mt-3">
      <h1>Profile</h1>
      <hr />
      <h4>Email:</h4>
      <h5>{user.email}</h5>
      <button
        className="btn btn-outline-warning"
        onClick={() => router.push("/auth/changepassword")}
      >
        Change Password
      </button>
    </div>
  );
};

export async function getServerSideProps() {
  const resp = await AxiosInstance.get("auth/customer/");
  console.log(resp);

  // Pass data to the page via props
  return { props: { resp } };
}

export default MyAccount;
