import { useState, useEffect } from "react";
import { useFormik } from "formik";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import AxiosInstance from "../../AxiosInstance";
import { useSelector } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import { Helmet } from "react-helmet";
import { Alert } from "@material-ui/lab";
import { MenuItem } from "@material-ui/core";
import { useParams } from "react-router";

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
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: "1px",
    background: "white",
    padding: "15px",
    borderRadius: "8px",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ItemCreate = ({ mode }) => {
  const [alerts, setAlerts] = useState([]);
  const [categories, setCategories] = useState([]);
  const classes = useStyles();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const shop_slug = useSelector((state) => state.user.shop_detail.slug);
  const { item_id } = useParams();
  const [title, setTitle] = useState("Create New Item");

  const HandleCreate = (values) => {
    AxiosInstance.post(url, values, {
      withCredentials: true,
    })
      .then((resp) => {
        setSuccess(true);
        formik.resetForm();
        // let msg = Object.entries(resp.data)[0][1];
        setAlerts([
          {
            message: "Item Creation Success!",
            type: "success",
          },
        ]);
      })
      .catch((err) => {
        setSuccess(false);
        let msg = Object.entries(err.response.data)[0][1];
        setAlerts([
          {
            message: msg,
            type: "error",
          },
        ]);
      })
      .finally(() => setProcessing(false));
  };

  const HandleUpdate = (values) => {
    AxiosInstance.patch(url, values, {
      withCredentials: true,
    })
      .then((resp) => {
        setSuccess(true);
        // let msg = Object.entries(resp.data)[0][1];
        setTitle(`Update Item | ${resp.data.name}`);
        setAlerts([
          {
            message: "Item Updated Successfully!",
            type: "success",
          },
        ]);
      })
      .catch((err) => {
        setSuccess(false);
        let msg = Object.entries(err.response.data)[0][1];
        setAlerts([
          {
            message: msg,
            type: "error",
          },
        ]);
      })
      .finally(() => setProcessing(false));
  };

  const RetrieveItemDetail = () => {
    AxiosInstance(`inventory/${shop_slug}/item/${item_id}/`)
      .then((resp) => {
        formik.setValues(resp.data);
        setTitle(`Update Item | ${resp.data.name}`);
      })
      .catch((err) => console.log(err.response));
  };
  useEffect(() => {
    if (item_id !== undefined) {
      setTitle("Update Item");
      RetrieveItemDetail();
    }
  }, []);

  useEffect(() => {
    AxiosInstance.get("inventory/category/")
      .then((resp) => {
        setCategories(resp.data);
      })
      .catch((err) => console.log(err.resp));
  }, []);
  var initialValues = {
    name: "",
    brand: "",
    description: "",
    cost_price: 0.0,
    quantity: 0,
    selling_price: 0.0,
    about_seller: "",
    category: 0,
  };

  const url = item_id
    ? `inventory/${shop_slug}/item/${item_id}/`
    : `inventory/${shop_slug}/item/`;

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      console.log(values);
      setProcessing(true);
      item_id ? HandleUpdate(values) : HandleCreate(values);
    },
  });

  return (
    <div>
      <h1>{title}</h1>
      <hr />

      <>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Container component="main" maxWidth="md">
          <CssBaseline />
          <div className={classes.paper}>
            <form className={classes.form} onSubmit={formik.handleSubmit}>
              <TextField
                autoFocus
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="category"
                name="category"
                select
                onChange={(e) => {
                  formik.handleChange(e);
                  console.log(formik.values);
                }}
                value={formik.values.category}
                label="Category"
              >
                {categories.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Product Name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="brand"
                label="Product Brand"
                type="text"
                id="brand"
                onChange={formik.handleChange}
                value={formik.values.brand}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="description"
                label="Description"
                type="textarea"
                id="description"
                onChange={formik.handleChange}
                value={formik.values.description}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="cost_price"
                label="Cost Price"
                type="textarea"
                id="cost_price"
                onChange={formik.handleChange}
                value={formik.values.cost_price}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="quantity"
                label="Quantity"
                type="textarea"
                id="quantity"
                onChange={formik.handleChange}
                value={formik.values.quantity}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="selling_price"
                label="Selling Price"
                type="textarea"
                id="selling_price"
                onChange={formik.handleChange}
                value={formik.values.selling_price}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="about_seller"
                label="About Seller"
                type="textarea"
                id="about_seller"
                onChange={formik.handleChange}
                value={formik.values.about_seller}
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
                  {item_id ? "Update" : "Create"} Item
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
          {alerts.map((alert) => {
            return (
              <Alert severity={alert.type} key={alert.message}>
                {alert.message}
              </Alert>
            );
          })}
        </Container>
      </>
    </div>
  );
};

export default ItemCreate;
