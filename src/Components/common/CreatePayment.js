import React from "react";
import { Button, Grid, TextField } from "@material-ui/core";
import AxiosInstance from "../../AxiosInstance";
import { useSelector } from "react-redux";
import { Alert } from "@material-ui/lab";

const CreatePayment = ({ transactionId, refreshTransactionData }) => {
  let initialData = Object.freeze({
    amount: "",
    amount2: "",
    transaction: transactionId,
  });
  const [formData, setFormData] = React.useState(initialData);
  const shop_slug = useSelector((state) => state.user.shop_detail.slug);
  const [alerts, setAlerts] = React.useState([]);
  const [success, setSuccess] = React.useState(true);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    AxiosInstance.post(`transactions/${shop_slug}/payment/`, formData)
      .then((resp) => {
        setSuccess(true);
        console.log(resp);
        setAlerts([
          {
            message: "Payment Added Successfully!",
            type: "success",
          },
        ]);
      })
      .catch((err) => {
        setSuccess(false);
        console.log(err.response);
        let msg = Object.entries(err.response.data)[0][1];
        setAlerts([
          {
            message: msg,
            type: "error",
          },
        ]);
      });
    setFormData(initialData);
    refreshTransactionData();
  };
  return (
    <div>
      <form action="" onSubmit={(e) => handleSubmit(e)}>
        <Grid container xs={12}>
          <Grid xs={6}>
            <TextField
              fullWidth
              style={{ padding: "0px 5px" }}
              variant="outlined"
              margin="normal"
              required
              id="amount"
              label="Add amount to transaction"
              name="amount"
              type="number"
              onChange={(e) => handleChange(e)}
              value={formData.amount}
            />
          </Grid>
          <Grid xs={6}>
            <TextField
              style={{ padding: "0px 5px" }}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="amount2"
              label="Confirm amount to transaction"
              name="amount2"
              type="number"
              onChange={(e) => handleChange(e)}
              value={formData.amount2}
            />
          </Grid>
          <Grid xs={12}>
            <Button
              style={{ margin: "0px 5px" }}
              color="primary"
              variant="contained"
              disableElevation
              type="submit"
              value="submit"
              disabled={
                parseInt(formData.amount) !== parseInt(formData.amount2)
              }
            >
              Add Amount
            </Button>
          </Grid>
          {alerts.map((alert) => {
            return (
              <Alert severity={alert.type} key={alert.message}>
                {alert.message}
              </Alert>
            );
          })}
        </Grid>
      </form>
    </div>
  );
};

export default CreatePayment;
