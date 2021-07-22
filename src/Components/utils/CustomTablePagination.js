import { makeStyles, TablePagination } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import React from "react";

const useStyles = makeStyles({
  paginationContainer: {
    display: "flex",
    right: "0px",
    justifyContent: "flex-end",
  },
  paginationItem: {
    padding: "10px 0px",
    alignSelf: "center",
  },
});

const CustomTablePagination = ({
  dataCount,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  const classes = useStyles();
  const TablePaginationActions = () => {
    return <></>;
  };

  return (
    <div className={classes.paginationContainer}>
      <TablePagination
        className={classes.paginationItem}
        rowsPerPageOptions={[5, 10, 25, 100]}
        component="div"
        count={dataCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={(e, page) => handleChangePage(e, page)}
        onChangeRowsPerPage={(e) => {
          handleChangeRowsPerPage(e);
        }}
        ActionsComponent={TablePaginationActions}
      />
      <Pagination
        color="primary"
        count={Math.ceil(dataCount / rowsPerPage)}
        page={page + 1}
        onChange={(e, num) => handleChangePage(e, num - 1)}
        className={classes.paginationItem}
      />
    </div>
  );
};

export default CustomTablePagination;
