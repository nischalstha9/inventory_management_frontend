import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const GetUserRole = () => {
  const role = useSelector((state) => state.user.role);
  console.log(role);
  return role;
};

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      GetUserRole === 1 ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: "login/", state: { from: props.location } }}
        />
      )
    }
  />
);
export default PrivateRoute;
