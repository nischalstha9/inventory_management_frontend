import React, { useState } from "react";
import AxiosInstance from "../../AxiosInstance";
import { useFormik } from "formik";
import { green } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import Helmet from "react-helmet";

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

export default function ForgetPassword() {
  const [alerts, setAlerts] = useState([]);
  const classes = useStyles();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const formik = useFormik({
    initialValues: { email: "" },
    onSubmit: (values) => {
      setProcessing(true);
      AxiosInstance.post(`auth/user/password/forget/`, values, {
        withCredentials: true,
      })
        .then((resp) => {
          setSuccess(false);
          setAlerts([
            {
              message:
                "Verification Email Sent! Please verify email and login again!",
              type: "success",
            },
          ]);
        })
        .catch((err) => {
          setSuccess(false);
          let msg = err.response.data.detail;
          setAlerts([
            {
              message: msg,
              type: "warning",
            },
          ]);
        })
        .finally(() => setProcessing(false));
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Helmet>
        <title>Forget Pasword</title>
      </Helmet>
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Forget Password
        </Typography>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            autoFocus
          />
          <div className={classes.buttonWrapper}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={processing}
              className={classes.submit}
            >
              Send Verification Email
            </Button>
            {processing && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
          <Grid container>
            <Grid item>
              <Link to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
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
