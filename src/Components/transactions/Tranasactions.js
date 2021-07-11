import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import AxiosInstance from "../../AxiosInstance";
import { useSelector } from "react-redux";
import { Button, ButtonGroup, TextField } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { FormControl } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
  },
  container: {
    maxHeight: 440,
  },
  searchForm: {
    marginTop: "10px",
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [dataCount, setdataCount] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");

  const shop_slug = useSelector((state) => state.user.shop_detail.slug);
  const url = `/transactions/${shop_slug}/transaction/?limit=${rowsPerPage}&offset=${
    page * rowsPerPage
  }&search=${searchQuery}`;
  useEffect(() => {
    AxiosInstance.get(url)
      .then((resp) => {
        setRows(resp.data.results);
        setdataCount(resp.data.count);
      })
      .catch((err) => console.log(err.response));
  }, [url]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  return (
    <>
      <Helmet>
        <title>Inventory Items</title>
      </Helmet>
      <Paper className={classes.root}>
        <h1>Transactions</h1>
        <hr />
        <FormControl className={classes.searchForm}>
          <TextField
            variant="outlined"
            label="Search"
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                setSearchQuery(e.target.value);
              }
            }}
          ></TextField>
        </FormControl>

        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Id</TableCell>
                <TableCell>Vendor/Client</TableCell>
                <TableCell>Item</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Cost Price Per Unit</TableCell>
                <TableCell>Total Payable</TableCell>
                <TableCell>Total Paid</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((trans) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={trans.id}>
                    <TableCell>{trans.date_of_trans}</TableCell>
                    <TableCell>{trans.id}</TableCell>
                    <TableCell>{trans.vendor_client}</TableCell>
                    <TableCell>{trans.item_name}</TableCell>
                    <TableCell>{trans._type}</TableCell>
                    <TableCell>{trans.quantity}</TableCell>
                    <TableCell>{trans.cost}</TableCell>
                    <TableCell>{trans.total_payable}</TableCell>
                    <TableCell>{trans.total_paid}</TableCell>
                    <TableCell>Delete / View</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={dataCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={(e) => {
            handleChangeRowsPerPage(e);
          }}
        />
      </Paper>
    </>
  );
}
