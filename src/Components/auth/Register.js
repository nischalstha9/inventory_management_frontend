import React, { useState } from "react";
import AxiosInstance from "../../AxiosInstance";
import { useHistory } from "react-router-dom";
//material-ui
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import { Alert } from "@material-ui/lab";
import { Helmet } from "react-helmet";

export default function Signup() {
  const initialFormData = Object.freeze({
    //object.freeze prevents from creating new obj elements
    email: "",
    password: "",
    password2: "",
  });
  const [alerts, setAlerts] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const handleFormErrors = (e) => {
    setFormErrors({
      ...formErrors,
      [e[0]]: e[1][0],
    });
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);

    AxiosInstance.post(`auth/user/`, formData)
      .then((resp) => {
        setFormErrors([]);
        setFormData(initialFormData);
        setSuccess(true);
        let msg =
          "Email Verification Sent! Please verify your email and login!!";
        setAlerts([
          {
            message: msg,
            type: "success",
          },
        ]);
      })
      .catch((err) => {
        setSuccess(false);
        let field_errors = Object.entries(err.response.data);
        field_errors.map((err) => {
          handleFormErrors(err);
        });
      })
      .finally(() => setProcessing(false));
  };

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
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <Helmet>
        <title>Register</title>
      </Helmet>
      <div className="white-container">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  type="email"
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => handleChange(e)}
                  error={formErrors.email ? true : false}
                  helperText={formErrors.email ? formErrors.email : ""}
                />
              </Grid>
              <br />
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(e) => handleChange(e)}
                  error={formErrors.password ? true : false}
                  helperText={formErrors.password ? formErrors.password : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  id="password2"
                  autoComplete="current-password2"
                  onChange={(e) => handleChange(e)}
                  error={formData.password !== formData.password2}
                  helperText={
                    formData.password !== formData.password2
                      ? "Both password are not matching!"
                      : ""
                  }
                />
              </Grid>
            </Grid>
            <div className={classes.buttonWrapper}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={
                  processing || formData.password !== formData.password2
                }
                onClick={(e) => handleSubmit(e)}
              >
                Sign Up
              </Button>
              {processing && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
            <Grid container justify="flex-end">
              <Grid item>
                <Link to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}></Box>
      </div>
      {alerts.map((alert) => {
        return (
          <Alert key={alert.message} severity={alert.type}>
            {alert.message}
          </Alert>
        );
      })}
    </Container>
  );
}
