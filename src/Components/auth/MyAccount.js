import React, { useState } from "react";
import { useHistory } from "react-router";
import { Container, Button, TextField } from "@material-ui/core";
import AxiosInstance from "../../AxiosInstance";
import { MenuItem } from "@material-ui/core";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";
import SaveIcon from "@material-ui/icons/Save";
import { useDispatch, useSelector } from "react-redux";
import { insert_user } from "../../redux/action";
import Grid from "@material-ui/core/Grid";
import { Helmet } from "react-helmet";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#fff",
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  buttonWrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
}));

const genders = [
  {
    value: "M",
    label: "Male",
  },
  {
    value: "F",
    label: "Female",
  },
  {
    value: "N",
    label: "No-information",
  },
  {
    value: "O",
    label: "Other",
  },
];

const MyAccount = () => {
  const dispatch = useDispatch();

  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  const user = useSelector((state) => state.user);

  const [formData, setFormData] = useState(user);
  const handleFormChange = (e) => {
    setSuccess(false);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };
  const handleSubmit = () => {
    setLoading(true);
    let form = document.getElementById("profileForm");
    let data = new FormData(form);
    AxiosInstance.patch("auth/user/", data)
      .then((resp) => {
        setSuccess(true);
        dispatch(insert_user(resp.data));
        localStorage.setItem("user", JSON.stringify(resp.data));
      })
      .catch((err) => {
        setSuccess(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Helmet>
        <title>Profile | {user.email}</title>
      </Helmet>
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Profile
        </Typography>
        <form
          autoComplete="off"
          className={classes.form}
          noValidate
          id="profileForm"
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <label for="avatar">
                <div
                  class="profile-pic"
                  style={{
                    backgroundImage: `url('${user.avatar_path}')`,
                  }}
                >
                  <span>Change Image</span>
                </div>
                <input
                  type="File"
                  name="avatar"
                  id="avatar"
                  onChange={(e) => {
                    let file = e.target.files[0];
                    formData["avatar"] = file;
                  }}
                />
              </label>
            </Grid>
            <Grid item xs={6}>
              <h2>
                Email: <h3>{user.email}</h3>
              </h2>

              <Button
                onClick={() => history.push("/change-password")}
                color="primary"
                variant="outlined"
                disableElevation
              >
                Change Password
              </Button>
            </Grid>
          </Grid>
          <br />
          <hr />
          <br />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                id="first_name"
                name="first_name"
                label="First Name"
                value={formData.first_name}
                onChange={(e) => handleFormChange(e)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="last_name"
                name="last_name"
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => handleFormChange(e)}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                id="phone"
                name="phone"
                label="Mobile Number"
                value={formData.phone}
                onChange={(e) => handleFormChange(e)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="gender"
                name="gender"
                select
                value={formData.gender}
                onChange={(e) => handleFormChange(e)}
                variant="outlined"
                label="Gender"
              >
                {genders.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {user.role === 2 ? (
              <Grid spacing={6}>
                <br />
                <TextField
                  id="dob"
                  name="dob"
                  type="date"
                  label="Date of Birth"
                  value={formData.dob}
                  onChange={(e) => handleFormChange(e)}
                  variant="outlined"
                />
              </Grid>
            ) : (
              ""
            )}
            <Grid spacing={6}>
              <div className={classes.wrapper}>
                <Fab
                  aria-label="save"
                  color="primary"
                  className={buttonClassname}
                  onClick={handleSubmit}
                >
                  {success ? <CheckIcon /> : <SaveIcon />}
                </Fab>
                {loading && (
                  <CircularProgress size={68} className={classes.fabProgress} />
                )}
              </div>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default MyAccount;
