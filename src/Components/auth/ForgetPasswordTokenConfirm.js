import React, { useEffect, useState } from "react";
import AxiosInstance from "../../AxiosInstance";
import Container from "@material-ui/core/Container";
import { CssBaseline } from "@material-ui/core";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import SetPasswordJSX from "../partials/SetPasswordJSX";
import Alert from "@material-ui/lab/Alert";

const ForgetPasswordTokenConfirm = () => {
  const [status, setStatus] = useState("Validating...");
  const [verifiedToken, setVerifiedToken] = useState(false);
  const { search } = useLocation();
  const params = queryString.parse(search);

  useEffect(() => {
    if (params.token !== undefined && params.identifier !== undefined) {
      let body = {
        token: params.token,
        identifier: params.identifier,
        type: 1, //1 is token type for forget password token
      };
      AxiosInstance.post("auth/token/valid/", body)
        .then((resp) => {
          let msg = Object.entries(resp.data)[0][1];
          setStatus(msg);
          setVerifiedToken(true);
        })
        .catch((err) => {
          let msg = Object.entries(err.response.data)[0][1];
          setStatus(msg);
          setVerifiedToken(false);
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
        {verifiedToken ? (
          <>
            {" "}
            <hr />
            <SetPasswordJSX
              token={params.token}
              identifier={params.identifier}
            />
          </>
        ) : (
          ""
        )}
      </Container>
    </div>
  );
};

export default ForgetPasswordTokenConfirm;
