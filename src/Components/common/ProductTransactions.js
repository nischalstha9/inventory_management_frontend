import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { yellow, red, green } from "@material-ui/core/colors";
import { Button } from "@material-ui/core";

const ProductTransactions = ({ transactions, type }) => {
  const StyledTableCell = withStyles((theme) => ({
    head: {
      background: type === "STOCK_IN" ? yellow[100] : red[100],
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  const PayButton = withStyles({
    root: {
      background: green[300],
      borderRadius: 3,
      border: 0,
      color: "white",
      height: 48,
      "&:hover": {
        background: green[200],
      },
    },
    label: {
      textTransform: "capitalize",
    },
  })(Button);
  const useStyles = makeStyles((theme) => ({
    root: {
      marginTop: "10px",
      width: "100%",
      padding: "10px",
    },
    container: {
      maxHeight: 440,
    },
  }));
  const classes = useStyles();
  return (
    <div>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Vendor/Client</StyledTableCell>
              <StyledTableCell>Quantity</StyledTableCell>
              <StyledTableCell>Total Payable</StyledTableCell>
              <StyledTableCell>Total Paid</StyledTableCell>
              <StyledTableCell>Remaining</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length !== 0 ? (
              transactions.map((trans) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={trans.id}>
                    <TableCell>{trans.date_of_trans}</TableCell>
                    <TableCell>{trans.vendor_client}</TableCell>
                    <TableCell>{trans.quantity}</TableCell>
                    <TableCell>{trans.total_payable}</TableCell>
                    <TableCell>{trans.total_paid}</TableCell>
                    <TableCell>
                      <PayButton variant="outlined">
                        Pay {trans.total_payable - trans.total_paid}
                      </PayButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow hover role="checkbox" tabIndex={-1}>
                No transactions!
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ProductTransactions;
