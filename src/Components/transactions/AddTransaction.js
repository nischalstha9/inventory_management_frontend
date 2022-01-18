import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AxiosInstance from "../../AxiosInstance";
import { useSelector } from "react-redux";
import {
  Button,
  CircularProgress,
  TextField,
  MenuItem,
} from "@material-ui/core";
import { Helmet } from "react-helmet";
import { green } from "@material-ui/core/colors";
import ProductInfo from "../common/ProductInfo";
import ProductTransactions from "../common/ProductTransactions";
import { yellow, red } from "@material-ui/core/colors";
import { Alert, Autocomplete } from "@material-ui/lab";
import { useHistory } from "react-router";
import { location } from "url-parse";
import TransactionProducts from "../common/TransactionProducts";
import * as yup from "yup";

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

export default function AddTransaction({ mode }) {
  //mode takes one value ("STOCK_IN or STOCK_OUT") if the transaction being sold or purchased
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [chooseItem, setChooseItem] = useState({});
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [transactionItems, setTransactionItems] = useState([]);

  const title = mode === "STOCK_IN" ? "Add Stock" : "Sell Stock";
  const shop_slug = useSelector((state) => state.user.shop_detail.slug);
  const shop_id = useSelector((state) => state.user.shop_detail.id);

  const history = useHistory();
  const queryString = require("query-string");
  const query = queryString.parse(history.location.search);
  const updateQuery = (param, value) => {
    const modifiedQuery = {
      ...query,
      [param]: value,
    };
    history.replace({
      pathname: location.pathname,
      search: queryString.stringify(modifiedQuery),
    });
  };

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
    item: query.product !== undefined ? query.product : 0,
    item_name: "",
    units: 0,
    price: 0.0,
  };

  if (mode === "STOCK_IN") {
    initialFormVal.selling_price = 0;
  }
  const retrieveItemDetail = (pk) => {
    setLoading(true);
    AxiosInstance(`/inventory/${shop_slug}/item/${pk}/`)
      .then((resp) => {
        let item = resp.data;
        setChooseItem(item);
        formik.setFieldValue("item_name", item.name);
        if (mode === "STOCK_IN") {
          formik.setFieldValue("price", item.cost_price);
          formik.setFieldValue("selling_price", item.selling_price);
        } else {
          formik.setFieldValue("price", item.selling_price);
        }
      })
      .catch((err) => console.log(err.resp));
    setLoading(false);
  };

  useEffect(() => {
    if (query.product !== undefined) {
      retrieveItemDetail(parseInt(query.product));
    }
  }, []);

  const validationSchema = yup.object({
    units: yup
      .number()
      .required("The number is required!")
      .positive("Quantity cannot be less than 1!")
      .test(
        "Is valid",
        `Only ${chooseItem.quantity} units avalilable for given item!`,
        (value) => value <= chooseItem.quantity
      ),
    item: yup
      .number()
      .required("Product cannot be empty!")
      .test(
        "Is not redundent",
        "Item already exists on table!",
        (value) =>
          transactionItems
            .map((item) => {
              return parseInt(item.item);
            })
            .includes(value) === false
      ),
  });

  const formik = useFormik({
    initialValues: initialFormVal,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setProcessing(true);
      let itemData = values;
      let trans = transactionItems;
      trans.push(itemData);
      setTransactionItems(trans);
      setAlerts([
        {
          message: "Item Added to Table!",
          type: "success",
        },
      ]);
      setProcessing(false);
    },
  });

  const initialFinalFormData = {
    vendor_client: null,
    paid: null,
    _type: mode,
    remarks: null,
    contact: null,
    shop: shop_id,
  };
  const [formData, setFormData] = useState(initialFinalFormData);

  const updateFormData = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  const createTransaction = () => {
    formData.transaction_items = transactionItems;
    const url = `transactions/${shop_slug}/transaction/`;
    AxiosInstance.post(url, formData, {
      withCredentials: true,
    })
      .then((resp) => {
        setSuccess(true);
        // formik.resetForm();
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
      .finally(() => {
        setProcessing(false);
        // setFormData(initialFinalFormData);
        // setTransactionItems([]);
      });
  };
  if (mode !== "STOCK_IN" && mode !== "STOCK_OUT") {
    return <h1>INVALID MODE</h1>;
  }
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Paper className={classes.root}>
        <h1>{title}</h1>
        <hr />
        <div className={classes.section}>
          <div className={classes.formSection}>
            {chooseItem === {} ? (
              "Choose Product to see it's details."
            ) : loading ? (
              <CircularProgress />
            ) : (
              <>
                <div className={classes.productInfo}>
                  <ProductInfo item={chooseItem} />
                </div>
                <hr />
              </>
            )}
            <form className={classes.form} onSubmit={formik.handleSubmit}>
              <Autocomplete
                id="item"
                name="item"
                type="number"
                options={items}
                getOptionLabel={(option) => option.name}
                autoComplete
                autoSelect
                autoHighlight
                disableClearable={true}
                style={{ width: "100%" }}
                onChange={(e, newValue) => {
                  formik.setFieldValue("item", newValue.id);
                  retrieveItemDetail(newValue.id);
                  updateQuery("product", newValue.id);
                  formik.setFieldValue("item_name", newValue.name);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Product"
                    error={formik.touched.item && Boolean(formik.errors.item)}
                    helperText={formik.touched.item && formik.errors.item}
                  />
                )}
              />
              {/* <TextField
                autoFocus
                variant="outlined"
                margin="normal"
                fullWidth
                id="item"
                name="item"
                type="number"
                select
                onChange={(e) => {
                  retrieveItemDetail(e.target.value);
                  updateQuery("product", e.target.value);
                  formik.setFieldValue("item_name", chooseItem.name);
                  formik.handleChange(e);
                }}
                error={formik.touched.item && Boolean(formik.errors.item)}
                helperText={formik.touched.item && formik.errors.item}
                value={formik.values.item}
                label="Product"
              >
                {items.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField> */}
              <TextField
                autoFocus
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="units"
                name="units"
                type="number"
                onChange={formik.handleChange}
                error={formik.touched.units && Boolean(formik.errors.units)}
                helperText={formik.touched.units && formik.errors.units}
                value={formik.values.units}
                label="Units"
              />
              <TextField
                autoFocus
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="price"
                name="price"
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                value={formik.values.price}
                label="Price"
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
                  + Add to table
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
          <div className={classes.infoSection}>
            <div>
              <h2>Item Table</h2>
              <TransactionProducts
                transaction_items={transactionItems}
                action={true}
                changeTransactions={(trans) => setTransactionItems(trans)}
                grand_total={
                  transactionItems.length > 0
                    ? transactionItems
                        .map((item) => item.price * parseInt(item.units))
                        .reduce((prev, next) => prev + next)
                    : 0
                }
              />
              <TextField
                autoFocus
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="vendor_client"
                name="vendor_client"
                onChange={(e) => updateFormData(e)}
                value={formData.vendor_client}
                label={mode === "STOCK_IN" ? "Vendor" : "Client"}
              />
              <TextField
                autoFocus
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="paid"
                name="paid"
                onChange={(e) => updateFormData(e)}
                value={formData.paid}
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
                onChange={(e) => updateFormData(e)}
                value={formData.remarks}
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
                onChange={(e) => updateFormData(e)}
                value={formData.contact}
                label="Contact"
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                disabled={processing}
                className={classes.submit}
                onClick={createTransaction}
              >
                Create Transaction
              </Button>
            </div>
          </div>
        </div>
      </Paper>
    </>
  );
}
