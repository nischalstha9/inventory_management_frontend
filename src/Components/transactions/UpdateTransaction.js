import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import AxiosInstance from "../../AxiosInstance";
import { useSelector } from "react-redux";
import { Button, CircularProgress, TextField } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { green } from "@material-ui/core/colors";
import TransactionInfoCard from "../common/TransactionInfoCard";
import CreatePayment from "../common/CreatePayment";
import PaymentTable from "../common/PaymentTable";
import { yellow, red } from "@material-ui/core/colors";
import { Alert } from "@material-ui/lab";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";

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
    minHeight: "100vh",
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
  productTableContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

export default function AddTransaction() {
  const classes = useStyles();
  const [chooseItem, setChooseItem] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [title, setTitle] = useState("Update Transaction");
  const [refresher, setRefresher] = useState(0);

  const shop_slug = useSelector((state) => state.user.shop_detail.slug);
  const { trans_id } = useParams();

  useEffect(() => {
    setLoading(true);
    let url = `transactions/${shop_slug}/transaction/${trans_id}/`;
    AxiosInstance.get(url)
      .then((resp) => {
        setTitle(
          `Update Transaction | ${resp.data.quantity} of ${resp.data.item_name}`
        );
        setChooseItem(resp.data);
        formik.setFieldValue("contact", resp.data.contact);
        formik.setFieldValue("remarks", resp.data.remarks);
      })
      .catch((err) => console.log(err.resp));
    setLoading(false);
  }, [shop_slug, trans_id, refresher]);

  let initialFormVal = {
    remarks: "",
    contact: 0,
  };

  const downloadPaymentTable = () => {
    let doc = new jsPDF("p", "pt", "letter");
    let table = document.querySelector("#PaymentTableData");
    doc.html(table, {
      callback: function (doc) {
        doc.output("pdfobjectnewwindow");
      },
      filename: "payment",
      html2canvas: {
        scale: 0.75,
        backgroundColor: "#c0c0c0",
      },
      x: 20,
      y: 20,
    });
  };

  const formik = useFormik({
    initialValues: initialFormVal,
    onSubmit: (values) => {
      setProcessing(true);
      const url = `transactions/${shop_slug}/transaction/${trans_id}/`;
      AxiosInstance.patch(url, values, {
        withCredentials: true,
      })
        .then((resp) => {
          setSuccess(true);
          // let msg = Object.entries(resp.data)[0][1];
          setAlerts([
            {
              message: "Transaction Updated Successfully!",
              type: "success",
            },
          ]);
          setChooseItem({ contact: resp.data.contact, ...chooseItem });
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
            ) : loading ? (
              <CircularProgress />
            ) : (
              <>
                <div className={classes.productInfo}>
                  <TransactionInfoCard transaction={chooseItem} />
                </div>
                <hr />
                <div className={classes.productInfo}>
                  <div className={classes.productTableContainer}>
                    <h4>Payment Table:</h4>
                    <Button
                      variant=""
                      disableElevation
                      size="small"
                      color="inherit"
                      onClick={downloadPaymentTable}
                    >
                      Download Payment Data
                    </Button>
                  </div>
                  <PaymentTable
                    payments={chooseItem.payments}
                    totalPaid={chooseItem.total_paid}
                    remainingAmount={chooseItem.remaining_payment}
                    totalPayable={chooseItem.total_payable}
                  />
                  {chooseItem.remaining_payment !== 0 ? (
                    <CreatePayment
                      refreshTransactionData={() => {
                        setRefresher(refresher + 1);
                      }}
                      transactionId={chooseItem.id}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <hr />
              </>
            )}
          </div>
          <div className={classes.formSection}>
            <form className={classes.form} onSubmit={formik.handleSubmit}>
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
              <div className={classes.buttonWrapper}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  disabled={processing}
                  className={classes.submit}
                >
                  Update Transaction
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
