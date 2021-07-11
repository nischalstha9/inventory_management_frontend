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

const ProductInfo = ({ item }) => {
  const classes = useStyles();
  return (
    <div>
      <p>
        <ul className={classes.ul}>
          <li>
            <span className={classes.meta}>Name:</span>
            <span className={classes.metaValue}>{item.name}</span>
          </li>
          <li>
            <span className={classes.meta}>Brand:</span>
            <span className={classes.metaValue}>{item.brand}</span>
          </li>
          <li>
            <span className={classes.meta}>Category:</span>
            <span className={classes.metaValue}>{item.category}</span>
          </li>
          <li>
            <span className={classes.meta}>Cost Price:</span>
            <span className={classes.metaValue}>{item.cost_price}</span>
          </li>
          <li>
            <span className={classes.meta}>Selling Price:</span>
            <span className={classes.metaValue}>{item.selling_price}</span>
          </li>
          <li>
            <span className={classes.meta}>Remaining Quantity:</span>
            <span className={classes.metaValue}>{item.quantity}</span>
          </li>
        </ul>
      </p>
    </div>
  );
};

export default ProductInfo;
