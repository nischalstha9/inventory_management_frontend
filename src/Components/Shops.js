import React from "react";
import AxiosInstance from "../AxiosInstance";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { TextField } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { FormControl } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Button } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { set_role, set_user_shop } from "../redux/action";

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
const Shops = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [dataCount, setdataCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };
  const history = useHistory();

  const handleLoginAs = (name, slug) => {
    dispatch(set_role(1));
    let shop = { name: name, slug: slug };
    dispatch(set_user_shop(shop));
    localStorage.setItem("role", 1);
    localStorage.setItem("shop_detail", JSON.stringify(shop));
    history.push("/inventory");
  };

  React.useEffect(() => {
    setLoading(true);
    AxiosInstance(
      `shop/list/?limit=${rowsPerPage}&offset=${
        page * rowsPerPage
      }&search=${searchQuery}`
    )
      .then((resp) => {
        setdataCount(resp.data.count);
        setRows(resp.data.results);
      })
      .catch((err) => console.log(err))
      .finally(setLoading(false));
  }, [rowsPerPage, searchQuery, page]);
  return (
    <>
      <Helmet>
        <title>Shops</title>
      </Helmet>
      <Paper className={classes.root}>
        <h1>Shops List</h1>
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
                <TableCell>Shop Name</TableCell>
                <TableCell>Contact Name</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Comission</TableCell>
                <TableCell>Verified</TableCell>
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
                rows.map((shop) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={shop.id}>
                      <TableCell>{shop.title}</TableCell>
                      <TableCell>{shop.contact_name || "NaN"}</TableCell>
                      <TableCell>{shop.contact_number || "NaN"}</TableCell>
                      <TableCell>{shop.commission}%</TableCell>
                      <TableCell>
                        {shop.verified ? "Verified" : "Not Verified"}
                      </TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          variant="outlined"
                          component={Link}
                          to={`/inventory/item/${shop.id}/edit`}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleLoginAs(shop.title, shop.slug)}
                          variant="outlined"
                          color="primary"
                        >
                          Login as {shop.title}
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
};

export default Shops;
