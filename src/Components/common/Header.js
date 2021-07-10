import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";

import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    textDecoration: "none",
    color: "#fff",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  loginBtn: {
    color: "#0f0f0f",
    borderColor: "#cdcd06",
    backgroundColor: "#cdcd06",
    margin: "0vh 1rem",
    "&:hover": {
      color: "#cdcd06",
      borderColor: "#0f0f0f",
      backgroundColor: "#0f0f0f",
    },
  },
  signUpBtn: {
    color: "#f0f0f0",
    borderColor: "#D64F33",
    backgroundColor: "#D64F33",
    "&:hover": {
      color: "#D64F33",
      borderColor: "#f0f0f0",
      backgroundColor: "#f0f0f0",
    },
  },
}));

export default function PrimarySearchAppBar() {
  const user = useSelector((state) => state.user);
  const authenticated = useSelector((state) => state.authenticated);
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem button>
          <ListItemIcon>
            <Avatar src={user.avatar_path} />
            <h4>{user.email}</h4>
          </ListItemIcon>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <h6>My Account Books</h6>
          </ListItemIcon>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemIcon>
            <LibraryBooksIcon />
          </ListItemIcon>
          <ListItemText primary="YOUR ITEM TEXT" />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemIcon>
            <h6>Manage My Books</h6>
          </ListItemIcon>
        </ListItem>
        <Divider />
      </List>
    </div>
  );

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = authenticated ? (
    <div>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem>
          <Link to="/profile">My account</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/logout">Logout</Link>
        </MenuItem>
      </Menu>
    </div>
  ) : (
    ""
  );

  let anchor = "left";

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          {authenticated ? (
            <Button onClick={toggleDrawer(anchor, true)}>
              <MenuIcon />
            </Button>
          ) : (
            ""
          )}
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
          <Typography
            className={classes.title}
            variant="h6"
            noWrap
            component={Link}
            to={"/"}
          >
            AWESOME WEBSITE TITLE
          </Typography>
          <div className={classes.grow} />
          <div>
            {authenticated ? (
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar src={user.avatar_path} />
              </IconButton>
            ) : (
              <>
                <Button
                  className={classes.signUpBtn}
                  component={Link}
                  to={"/register"}
                  variant="contained"
                  color="error"
                  disableElevation
                >
                  Register
                </Button>
                <Button
                  component={Link}
                  to={"/login"}
                  color="login"
                  variant="outlined"
                  className={classes.loginBtn}
                  disableElevation
                >
                  LogIn
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}
