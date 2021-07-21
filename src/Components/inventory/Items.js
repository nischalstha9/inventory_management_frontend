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
import { MenuItem, TextField } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { FormControl } from "@material-ui/core";
import ProductInfoDialog from "../common/ProductInfoDialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
  },
  container: {},
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
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categories, setCategories] = React.useState([]);
  const initialFilter = Object.freeze({
    category: null,
    brand: null,
  });
  const [filter, setFilter] = React.useState(initialFilter);
  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const shop_slug = useSelector((state) => state.user.shop_detail.slug);

  useEffect(() => {
    setLoading(true);
    AxiosInstance("inventory/category/")
      .then((resp) => setCategories(resp.data))
      .catch((err) => console.log(err));
  }, []);

  const url = `/inventory/${shop_slug}/item/?limit=${rowsPerPage}&offset=${
    page * rowsPerPage
  }&search=${searchQuery}&category=${filter.category || ""}&brand=${
    filter.brand || ""
  }`;
  useEffect(() => {
    setLoading(true);
    AxiosInstance.get(url).then((resp) => {
      setRows(resp.data.results);
      setdataCount(resp.data.count);
    });
    setLoading(false);
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
        <h1>Inventory Items</h1>
        <hr />
        <Grid container xs={12}>
          <Grid xs={3}>
            <FormControl className={classes.searchForm}>
              <TextField
                variant="outlined"
                label="Search"
                onKeyUp={(e) => {
                  if (e.keyCode === 13) {
                    setSearchQuery(e.target.value);
                  }
                }}
              />
            </FormControl>
          </Grid>
          <Grid xs={3}>
            <FormControl className={classes.searchForm}>
              <TextField
                variant="outlined"
                select
                id="category"
                name="category"
                label="Categories"
                type="text"
                displayEmpty
                onChange={(e) => handleFilterChange(e)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
        </Grid>

        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Remaining Quantity</TableCell>
                <TableCell>Cost Price</TableCell>
                <TableCell>Selling Price</TableCell>
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
                rows.map((item) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                      <TableCell>
                        <ProductInfoDialog
                          itemName={item.name}
                          itemId={item.id}
                        />
                      </TableCell>
                      <TableCell>{item.brand}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>Rs. {item.cost_price}</TableCell>
                      <TableCell>Rs. {item.selling_price}</TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          variant="outlined"
                          component={Link}
                          to={`/inventory/item/${item.id}/edit`}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
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
