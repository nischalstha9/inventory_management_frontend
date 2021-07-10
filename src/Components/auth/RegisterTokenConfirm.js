import React, { useEffect, useState } from "react";
import AxiosInstance from "../../AxiosInstance";
import Container from "@material-ui/core/Container";
import { CssBaseline } from "@material-ui/core";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";

const RegisterTokenConfirm = () => {
  const [status, setStatus] = useState("Validating...");
  const { search } = useLocation();
  const params = queryString.parse(search);

  useEffect(() => {
    if (params.token !== undefined && params.identifier !== undefined) {
      let body = {
        token: params.token,
        identifier: params.identifier,
        type: 0, //0 is token type for registration token
      };
      AxiosInstance.post("auth/user/activate/", body)
        .then((resp) => {
          let msg = Object.entries(resp.data)[0][1];
          setStatus(msg);
        })
        .catch((err) => {
          let msg = Object.entries(err.response.data)[0][1];
          setStatus(msg);
        });
    } else {
      setStatus("Invalid Token!! Please resend verification email!!!");
    }
  }, []);

  return (
    <div>
      <Container>
        <CssBaseline />
        <h1>Token Validation</h1>
        <hr />
        <Alert severity="info">{status}</Alert>
      </Container>
    </div>
  );
};

export default RegisterTokenConfirm;
