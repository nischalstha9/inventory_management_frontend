import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AxiosInstance from "../../AxiosInstance";
import { useSelector } from "react-redux";
import { Button, CircularProgress, TextField } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { MenuItem } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import ProductInfo from "../common/ProductInfo";
import ProductTransactions from "../common/ProductTransactions";
import { yellow, red } from "@material-ui/core/colors";
import { Alert } from "@material-ui/lab";

export const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    height: "auto",
  },
  searchForm: {
    marginTop: "10px",
  },
  section: {
    display: "flex",
  },
  infoSection: {
    width: "50%",
    height: "100vh",
    padding: "5px",
  },
  formSection: {
    width: "50%",
    padding: "5px",
  },
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
  ul: {
    listStyle: "none",
  },
  meta: {
    fontWeight: "bold",
  },
  productInfo: {
    padding: "0px 0px 10px 0px",
    margin: "10px 0px",
  },
  StockInTransTable: {
    padding: "5px",
    margin: "10px 0px",
    background: yellow[100],
    borderRadius: "8px",
  },
  StockOutTransTable: {
    padding: "5px",
    margin: "10px 0px",
    background: red[100],
    borderRadius: "8px",
  },
}));

export default function AddTransaction() {
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [chooseItem, setChooseItem] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const mode =
    window.location.pathname === "/transactions/add-stock"
      ? "STOCK_IN"
      : "STOCK_OUT";

  const title = mode === "STOCK_IN" ? "Add Stock" : "Sell Stock";

  const shop_slug = useSelector((state) => state.user.shop_detail.slug);

  useEffect(() => {
    let url = `inventory/${shop_slug}/item/`;
    if (mode === "STOCK_OUT") {
      url += `?quantity__gt=0`;
    }
    AxiosInstance.get(url)
      .then((resp) => {
        setItems(resp.data);
      })
      .catch((err) => console.log(err.resp));
  }, []);

  let initialFormVal = {
    _type: mode,
    vendor_client: "",
    item: 0,
    quantity: 0,
    cost: 0.0,
    paid: 0.0,
    remarks: "",
    contact: 0,
  };

  if (mode === "STOCK_IN") {
    initialFormVal.selling_price = 0;
  }
  const retrieveItemDetail = (pk) => {
    AxiosInstance(`/inventory/${shop_slug}/item/${pk}/`)
      .then((resp) => {
        setChooseItem(resp.data);
        formik.setFieldValue("cost", resp.data.selling_price);
      })
      .catch((err) => console.log(err.resp));
  };

  const formik = useFormik({
    initialValues: initialFormVal,
    onSubmit: (values) => {
      setProcessing(true);
      const url = `transactions/${shop_slug}/transaction/`;
      AxiosInstance.post(url, values, {
        withCredentials: true,
      })
        .then((resp) => {
          setSuccess(true);
          formik.resetForm();
          // let msg = Object.entries(resp.data)[0][1];
          setAlerts([
            {
              message: "Transaction Creation Success!",
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
    },
  });
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Paper className={classes.root}>
        <h1>{title}</h1>
        <hr />
        <div className={classes.section}>
          <div className={classes.infoSection}>
            {chooseItem === null ? (
              "Choose Product to see it's details."
            ) : (
              <>
                <div className={classes.productInfo}>
                  <ProductInfo item={chooseItem} />
                </div>
                <hr />
                <div className={classes.StockInTransTable}>
                  <h4>Stock In Unpaid Transaction</h4>
                  <hr />
                  <ProductTransactions
                    transactions={chooseItem.transactions.stock_in}
                    type="STOCK_IN"
                  />
                </div>
                <div className={classes.StockOutTransTable}>
                  <h4>Stock Out Unpaid Transaction</h4>
                  <hr />
                  <ProductTransactions
                    transactions={chooseItem.transactions.stock_out}
                    type="STOCK_OUT"
                  />
                </div>
              </>
            )}
          </div>
          <div className={classes.formSection}>
            <form className={classes.form} onSubmit={formik.handleSubmit}>
              <TextField
                autoFocus
                variant="outlined"
                margin="normal"
                fullWidth
                id="item"
                name="item"
                select
                onChange={(e) => {
                  retrieveItemDetail(e.target.value);
                  formik.handleChange(e);
                }}
                value={formik.values.item}
                label="Product"
              >
                {items.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                autoFocus
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="vendor_client"
                name="vendor_client"
                onChange={formik.handleChange}
                value={formik.values.vendor_client}
                label={mode === "STOCK_IN" ? "Vendor" : "Client"}
              />
              <TextField
                autoFocus
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="quantity"
                name="quantity"
                onChange={formik.handleChange}
                value={formik.values.quantity}
                label="Quantity"
              />
              <TextField
                autoFocus
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="cost"
                name="cost"
                onChange={formik.handleChange}
                value={formik.values.cost}
                label="Cost Price"
              />
              <TextField
                autoFocus
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="paid"
                name="paid"
                onChange={formik.handleChange}
                value={formik.values.paid}
                label="Paid Amount"
              />
              <TextField
                autoFocus
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="remarks"
                name="remarks"
                onChange={formik.handleChange}
                value={formik.values.remarks}
                label="Remarks"
              />
              <TextField
                autoFocus
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="contact"
                name="contact"
                onChange={formik.handleChange}
                value={formik.values.contact}
                label="Contact"
              />
              {mode === "STOCK_IN" ? (
                <TextField
                  autoFocus
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="selling_price"
                  name="selling_price"
                  onChange={formik.handleChange}
                  value={formik.values.selling_price}
                  label="Selling Price"
                />
              ) : (
                ""
              )}
              <div className={classes.buttonWrapper}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  disabled={processing}
                  className={classes.submit}
                >
                  {mode === "STOCK_IN"
                    ? "Add to inventory"
                    : "Sell from inventory"}
                </Button>
                {processing && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </div>
            </form>
            {alerts.map((alert) => {
              return (
                <Alert severity={alert.type} key={alert.message}>
                  {alert.message}
                </Alert>
              );
            })}
          </div>
        </div>
      </Paper>
    </>
  );
}
