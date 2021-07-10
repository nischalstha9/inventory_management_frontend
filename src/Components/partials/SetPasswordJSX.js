import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import { Alert } from "@material-ui/lab";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import AxiosInstance from "../../AxiosInstance";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  buttonWrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SetPasswordJSX = ({ token, identifier }) => {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const classes = useStyles();
  const initialFormData = Object.freeze({
    //object.freeze prevents from creating new obj elements
    new_password1: "",
    new_password2: "",
    token: token,
    identifier: identifier,
    type: 1, //1 is token type for forget password token
  });
  const [formData, setFormData] = useState(initialFormData);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handlePasswordFormSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    AxiosInstance.post(`auth/user/password/reset/`, formData, {
      withCredentials: true,
    })
      .then((resp) => {
        setProcessing(false);
        console.log(resp);
        setAlerts([
          {
            message: "Password Change Success! Please Try to Login!!",
            type: "success",
          },
        ]);
        setSuccess(true);
      })
      .catch((err) => {
        setProcessing(false);
        let msg = Object.entries(err.response.data)[0][1][0];
        console.log(msg);
        setAlerts([
          {
            message: msg,
            type: "danger",
          },
        ]);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      {!success ? (
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Change Password
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              // autoFocus
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="password"
              label="New Password"
              id="new_password1"
              onChange={(e) => handleChange(e)}
              value={formData.new_password1}
              name="new_password1"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="password"
              label="Confirm New Password"
              id="new_password2"
              onChange={(e) => handleChange(e)}
              name="new_password2"
            />
            <div className={classes.buttonWrapper}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={processing}
                className={classes.submit}
                onClick={(e) => handlePasswordFormSubmit(e)}
              >
                Change Password
              </Button>
              {processing && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </form>
        </div>
      ) : (
        <Link to="/login">Click here to login.</Link>
      )}
      {alerts.map((alert) => {
        return (
          <Alert key={alert.message} severity={alert.type}>
            {alert.message}
          </Alert>
        );
      })}
    </Container>
  );
};

export default SetPasswordJSX;
