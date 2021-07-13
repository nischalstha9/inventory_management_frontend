import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  ul: {
    listStyle: "none",
  },
  meta: {
    fontWeight: "bold",
  },
  metaValue: {
    margin: "0px 5px",
  },
}));

const ProductInfo = ({ transaction }) => {
  const classes = useStyles();
  return (
    <div>
      <p>
        <ul className={classes.ul}>
          <li>
            <span className={classes.meta}>Transaction Id:</span>
            <span className={classes.metaValue}>{transaction.id}</span>
          </li>
          <hr />
          <li>
            <span className={classes.meta}>Payment for Item:</span>
            <br />
            <span className={classes.meta}>Item Name:</span>
            <span className={classes.metaValue}>{transaction.item_name}</span>
            <br />
            <span className={classes.meta}>Item ID:</span>
            <span className={classes.metaValue}>{transaction.item}</span>
          </li>
          <hr />
          <li>
            <span className={classes.meta}>Date of Transaction:</span>
            <span className={classes.metaValue}>
              {transaction.date_of_trans}
            </span>
          </li>
          <li>
            <span className={classes.meta}>Vendor/ Client Name:</span>
            <span className={classes.metaValue}>
              {transaction.vendor_client}
            </span>
          </li>
          <li>
            <span className={classes.meta}>Vendor/ Client Contact:</span>
            <span className={classes.metaValue}>{transaction.contact}</span>
          </li>
          <li>
            <span className={classes.meta}>Quantity:</span>
            <span className={classes.metaValue}>
              {transaction.quantity} units
            </span>
          </li>
          <li>
            <span className={classes.meta}>Total Payable:</span>
            <span className={classes.metaValue}>
              Rs. {transaction.total_payable}
            </span>
          </li>
          <li>
            <span className={classes.meta}>Total Paid:</span>
            <span className={classes.metaValue}>
              Rs. {transaction.total_paid}
            </span>
          </li>
          <li>
            <span className={classes.meta}>Remaining Amount:</span>
            <span className={classes.metaValue}>
              Rs. {transaction.remaining_payment}
            </span>
          </li>
        </ul>
      </p>
    </div>
  );
};

export default ProductInfo;