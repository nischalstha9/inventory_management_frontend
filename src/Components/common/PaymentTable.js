import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import jsPDF from "jspdf";
import React from "react";

const StyledTableCell = withStyles((theme) => ({
  head: {
    background: "#93efbb",
  },
  body: {
    background: "#93efbb",
    fontSize: 14,
  },
}))(TableCell);
const StyledTableContainer = withStyles((theme) => ({
  root: {
    background: "#93efbb",
    borderRadius: "5px",
  },
}))(TableContainer);

const PaymentTable = ({
  payments,
  totalPaid,
  remainingAmount,
  totalPayable,
}) => {
  const downloadReceipt = () => {
    console.log("dwonlad");
    var doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(70, 20, "Payment Receipt");
    doc.save();
  };
  return (
    <div className="">
      <StyledTableContainer>
        <Table stickyHeader aria-label="sticky table" id="PaymentTableData">
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Amount Paid</StyledTableCell>
              <StyledTableCell>Remaining Amount</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => {
              return (
                <TableRow>
                  <TableCell>{payment.date_of_pay}</TableCell>
                  <TableCell>Rs. {payment.amount}</TableCell>
                  <TableCell>Rs. {(totalPayable -= payment.amount)}</TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <StyledTableCell>
                <b>Total Paid:</b>
              </StyledTableCell>
              <StyledTableCell>
                <b>Rs. {totalPaid}</b>
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell>
                <b>Remaining Amount:</b>
              </StyledTableCell>
              <StyledTableCell>
                <b>Rs. {remainingAmount}</b>
              </StyledTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </StyledTableContainer>
    </div>
  );
};

export default PaymentTable;
