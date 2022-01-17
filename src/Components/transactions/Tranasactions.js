import React, { useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import AxiosInstance from "../../AxiosInstance";
import { useSelector } from "react-redux";
import { Button, TextField } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { MenuItem } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import { Chip } from "@material-ui/core";
import ProductInfoDialog from "../common/ProductInfoDialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import CustomTablePagination from "../utils/CustomTablePagination";
import { Select } from "@material-ui/core";

export const BalancedChip = withStyles({
  root: {
    background: "#3bb771",
    color: "white",
    width: "100%",
  },
  label: {
    textTransform: "capitalize",
  },
})(Chip);
export const UnBalancedChip = withStyles({
  root: {
    background: "#b73b3b",
    color: "white",
    width: "100%",
  },
  label: {
    textTransform: "capitalize",
  },
})(Chip);
export const AddPaymentBtn = withStyles({
  root: {
    background: "#ffc743",
    width: "100%",
    margin: "1px",
  },
  label: {
    textTransform: "capitalize",
  },
})(Button);
export const ViewEditButton = withStyles({
  root: {
    background: "#3cafaf",
    color: "white",
    width: "100%",
    margin: "1px",
    "&:hover": {
      background: "#3caff0",
    },
  },
  label: {
    textTransform: "capitalize",
  },
})(Button);

const useStyles = makeStyles({
  root: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
  },
  container: {},
  searchForm: {
    margin: "10px 0px",
    display: "flex",
    flexDirection: "auto",
    borderRadius: "7px",
    padding: "5px",
  },
  formEntity: {
    margin: "0px 0px",
    padding: "0px 7px",
    display: "flex",
    flexDirection: "column",
  },
});

export default function StickyHeadTable() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [dataCount, setdataCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const initialFormData = Object.freeze({
    //object.freeze prevents from creating new obj elements
    type: "",
    balanced: "",
    sdate: "",
    edate: "",
    search: "",
    trans_search: "",
  });
  const [filterForm, setFilterForm] = React.useState(initialFormData);

  const handleFormChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "sdate" || e.target.name === "edate") {
      let date;
      try {
        date = new Date(value).toISOString();
      } catch {
        date = "";
      }
      setFilterForm({
        ...filterForm,
        [e.target.name]: date,
      });
    } else {
      setFilterForm({
        ...filterForm,
        [e.target.name]: value.trim(),
      });
    }
  };

  const shop_slug = useSelector((state) => state.user.shop_detail.slug);
  var url = `/transactions/${shop_slug}/transaction/?limit=${rowsPerPage}&offset=${
    page * rowsPerPage
  }&search=${filterForm.search}&_type=${filterForm.type}&balanced=${
    filterForm.balanced
  }&id=${filterForm.trans_search}&date__gte=${
    filterForm.sdate || ""
  }&date__lte=${filterForm.edate || ""}`;
  useEffect(() => {
    setLoading(true);
    AxiosInstance.get(url)
      .then((resp) => {
        setRows(resp.data.results);
        setdataCount(resp.data.count);
      })
      .catch((err) => console.log(err.response));
    setLoading(false);
  }, [url, filterForm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const downloadTable = () => {
    function createHeaders(keys) {
      var result = [];
      for (var i = 0; i < keys.length; i += 1) {
        result.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 65,
          align: "center",
          padding: 0,
        });
      }
      return result;
    }

    var headers = createHeaders([
      "Date",
      "Id",
      "Vendor/Client",
      "Item",
      "Type",
      "Quantity",
      "Price Per Unit",
      "Total Payable",
      "Total Paid",
      "Remaining Amount",
    ]);

    var generateData = function (rows) {
      var result = [];
      rows.forEach((row) => {
        var data = {
          Date: row.date_of_trans.toString(),
          Id: row.id.toString(),
          "Vendor/Client": row.vendor_client.toString(),
          Item: row.item_name.toString(),
          Type: row._type.toString(),
          Quantity: row.quantity.toString(),
          "Price Per Unit": row.cost.toString(),
          "Total Payable": row.total_payable.toString(),
          "Total Paid": row.total_paid.toString(),
          "Remaining Amount": (row.total_payable - row.total_paid).toString(),
        };
        result.push(Object.assign({}, data));
      });
      return result;
    };

    var doc = new jsPDF({ putOnlyUsedFonts: false, orientation: "l" });
    doc.text(10, 10, "Transaction Table");
    let table = doc.table(10, 16, generateData(rows), headers, {
      autoSize: true,
      fontSize: 9,
    });
    table.output("pdfobjectnewwindow");
  };

  const types = [
    { label: "All Transactions", value: "" },
    { label: "Stock In Transactions", value: "STOCK_IN" },
    { label: "Stock Out Transactions", value: "STOCK_OUT" },
  ];
  const balanced_types = [
    { label: "All Transactions", value: "" },
    { label: "Balanced Transactions", value: "true" },
    { label: "Unpaid Transactions", value: "false" },
  ];

  return (
    <>
      <Helmet>
        <title>Transactions</title>
      </Helmet>
      <Paper className={classes.root}>
        <h1>All Transactions</h1>
        <hr />
        <form
          className={classes.searchForm}
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Grid container>
            <Grid container xs={12}>
              <Grid className={classes.formEntity} xs={3}>
                <label htmlFor="type">Transaction Type:</label>
                <Select
                  type="text"
                  displayEmpty
                  id="type"
                  name="type"
                  value={filterForm.type}
                  onChange={(e) => {
                    handleFormChange(e);
                  }}
                >
                  {types.map((type, index) => (
                    <MenuItem key={index} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid className={classes.formEntity} xs={3}>
                <label htmlFor="balanced">Balanced:</label>
                <Select
                  type="text"
                  name="balanced"
                  displayEmpty
                  id="balanced"
                  value={filterForm.balanced}
                  onChange={(e) => {
                    handleFormChange(e);
                  }}
                >
                  {balanced_types.map((type, index) => (
                    <MenuItem key={index} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid className={classes.formEntity} xs={3}>
                <label htmlFor="sdate">Start Date:</label>
                <TextField
                  type="date"
                  name="sdate"
                  onChange={(e) => {
                    handleFormChange(e);
                  }}
                ></TextField>
              </Grid>
              <Grid className={classes.formEntity} xs={3}>
                <label htmlFor="sdate">End Date:</label>
                <TextField
                  type="date"
                  name="edate"
                  onChange={(e) => {
                    handleFormChange(e);
                  }}
                ></TextField>
              </Grid>
            </Grid>
            <Grid container xs={12}>
              <Grid className={classes.formEntity} xs={4}>
                <label htmlFor="search">
                  Search By Product or Vendor/Client:
                </label>
                <TextField
                  name="search"
                  onKeyUp={(e) => {
                    if (e.keyCode === 13) {
                      handleFormChange(e);
                    }
                  }}
                ></TextField>
              </Grid>
              <Grid className={classes.formEntity} xs={4}>
                <label htmlFor="search">Search By Transaction ID:</label>
                <TextField
                  fullWidth
                  name="trans_search"
                  onKeyUp={(e) => {
                    if (e.keyCode === 13) {
                      handleFormChange(e);
                    }
                  }}
                ></TextField>
              </Grid>
              <Grid className={classes.formEntity} xs={4}>
                <Button
                  onClick={downloadTable}
                  variant="outlined"
                  color="primary"
                >
                  Download Table Data
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {/* <div className={classes.formEntity}>
            <Button type="submit">Filter</Button>
            <Button type="reset">Reset</Button>
          </div> */}
        </form>

        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Id</TableCell>
                <TableCell>Vendor/Client</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Total Payable</TableCell>
                <TableCell>Total Paid</TableCell>
                <TableCell>Remaining Payment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow hover tabIndex={-1}>
                  <TableCell colspan={11}>
                    <CircularProgress disableShrink />
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((trans) => {
                  let balanced = trans.grand_total - trans.total_paid === 0;
                  return (
                    <TableRow hover tabIndex={-1} key={trans.id}>
                      <TableCell>{trans.date_of_trans}</TableCell>
                      <TableCell>{trans.id}</TableCell>
                      <TableCell>{trans.vendor_client}</TableCell>
                      <TableCell>{trans._type}</TableCell>
                      <TableCell>Rs. {trans.grand_total}</TableCell>
                      <TableCell>Rs. {trans.total_paid}</TableCell>
                      <TableCell>
                        {balanced ? (
                          <BalancedChip label="Balanced" />
                        ) : (
                          <UnBalancedChip
                            label={`Rs. ${
                              trans.grand_total - trans.total_paid
                            }`}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Grid>
                          <Grid>
                            <ViewEditButton
                              component={Link}
                              to={`transactions/${trans.id}/update`}
                            >
                              View/Edit{balanced ? "" : "/Pay"}
                            </ViewEditButton>
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <CustomTablePagination
            dataCount={dataCount}
            rowsPerPage={rowsPerPage}
            page={page}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Paper>
    </>
  );
}
