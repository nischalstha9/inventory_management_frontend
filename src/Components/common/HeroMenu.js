import { Button, ButtonGroup } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  btn_grp: {
    margin: "0px 5px 0px 5px",
  },
}));

const HeroMenu = () => {
  const classes = useStyles();
  return (
    <div className="menu-btns">
      <ButtonGroup
        color="primary"
        variant="outlined"
        aria-label="outlined primary button group"
        className={classes.btn_grp}
      >
        <Button component={Link} to="/inventory/new">
          Add New Item
        </Button>
        <Button>Sum more btn</Button>
      </ButtonGroup>
      <ButtonGroup
        color="primary"
        variant="outlined"
        aria-label="outlined primary button group"
        className={classes.btn_grp}
      >
        <Button component={Link} to="/transactions/add-stock">
          Add Stock
        </Button>
        <Button component={Link} to="/transactions/sell-stock">
          Sell Stock
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default HeroMenu;
