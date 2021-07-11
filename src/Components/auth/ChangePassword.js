import { useState } from "react";
import { useFormik } from "formik";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import AxiosInstance from "../../AxiosInstance";
import { useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import { Alert } from "@material-ui/lab";
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

export default function ChangePassword() {
  const [alerts, setAlerts] = useState([]);
  const history = useHistory();
  const classes = useStyles();
  const [processing, setProcessing] = useState(false);
  const passwordChangeForm = useFormik({
    initialValues: { old_password:"", new_password1:"", new_password2:"" },
    onSubmit: (values) => {
      setProcessing(true);
      AxiosInstance.post(`auth/user/password/change/`, values, {
        withCredentials: true,
      })
        .then((resp) => {
          setProcessing(false);
          alert("Password Change Success! Please Login Again!");
          history.push("/logout");
        })
        .catch((err) => {
          setProcessing(false);
          let msg = Object.entries(err.response.data)[0][1][0];
          setAlerts([
            {
              message: msg,
              type: "error",
            },
          ]);
        });
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Helmet>
        <title>Change Password</title>
      </Helmet>
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Change Password
        </Typography>
        <form
          className={classes.form}
          onSubmit={passwordChangeForm.handleSubmit}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="old_password"
            label="Old Password"
            name="old_password"
            type="password"
            onChange={passwordChangeForm.handleChange}
            value={passwordChangeForm.values.old_password}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="password"
            label="New Password"
            id="new_password1"
            onChange={passwordChangeForm.handleChange}
            value={passwordChangeForm.values.new_password1}
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
            onChange={passwordChangeForm.handleChange}
            value={passwordChangeForm.values.new_password2}
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
            >
              Change Password
            </Button>
            {processing && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
          <Grid container>
            <Grid item xs>
              <Link to="/forget-password" variant="body2">
                Forgot password?
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
