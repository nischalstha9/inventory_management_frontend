import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import ProductInfo from "./ProductInfo";
import ProductTransactions from "./ProductTransactions";
import { useStyles as TransactionStyles } from "../transactions/AddTransaction";
import AxiosInstance from "../../AxiosInstance";
import { useSelector } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    minWidth: "500px",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function CustomizedDialogs({ itemName, itemId }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [item, setItem] = React.useState(null);
  const shop_slug = useSelector((state) => state.user.shop_detail.slug);

  const handleClickOpen = () => {
    setLoading(true);
    AxiosInstance.get(
      `/inventory/${shop_slug}/item/${itemId}/?show_transactions=true`
    )
      .then((resp) => setItem(resp.data))
      .catch((err) => console.log(err.response));
    setOpen(true);
    setLoading(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const classes = TransactionStyles();

  return (
    <div className="itemDialogModal">
      <span className="itemName" onClick={handleClickOpen}>
        {itemName}
      </span>
      <Dialog
        maxWidth="xl"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {itemName}
        </DialogTitle>
        {loading ? (
          <CircularProgress disableShrink />
        ) : (
          <DialogContent dividers>
            {item !== null ? (
              <Typography gutterBottom>
                <>
                  <div className={classes.productInfo}>
                    <ProductInfo item={item} />
                  </div>
                  <hr />
                  {item.transactions.stock_in.length > 0 ? (
                    <div className={classes.StockInTransTable}>
                      <h4>Stock In Unpaid Transaction</h4>
                      <hr />
                      <ProductTransactions
                        transactions={item.transactions.stock_in}
                        type="STOCK_IN"
                      />
                    </div>
                  ) : (
                    ""
                  )}

                  {item.transactions.stock_out.length > 0 ? (
                    <div className={classes.StockOutTransTable}>
                      <h4>Stock Out Unpaid Transaction</h4>
                      <hr />
                      <ProductTransactions
                        transactions={item.transactions.stock_out}
                        type="STOCK_OUT"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </>
              </Typography>
            ) : (
              ""
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
