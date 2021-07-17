import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { set_role } from "../../redux/action";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

const changeMenuBtn = () => {
  let sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("open");
  menuBtnChange(); //calling the function(optional)
};

// // following are the code to change sidebar button(optional)
function menuBtnChange() {
  let sidebar = document.querySelector(".sidebar");
  let closeBtn = document.querySelector("#btn");
  if (sidebar.classList.contains("open")) {
    closeBtn.classList.replace("bx-menu", "bx-menu-alt-right"); //replacing the iocns className
    localStorage.setItem("sidebar_toggle", true);
  } else {
    closeBtn.classList.replace("bx-menu-alt-right", "bx-menu"); //replacing the iocns className
    localStorage.setItem("sidebar_toggle", false);
  }
}

const SideNav = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user);
  const emulated_role = useSelector((state) => state.role);
  const role = useSelector((state) => state.user.role);
  let savedSidebarToggleStatus = localStorage.getItem("sidebar_toggle");
  let sidebar_classes =
    savedSidebarToggleStatus === "true" ? "sidebar open" : "sidebar";

  const logoutAsShop = () => {
    dispatch(set_role(0));
    localStorage.setItem("role", user.role);
    localStorage.removeItem("shop_detail");
    history.push("/shops");
  };

  return (
    <div className={sidebar_classes}>
      <ul className="nav-list">
        <div className="logo-details">
          <i className="bx bxl-c-plus-plus icon"></i>
          <div className="logo_name">Inventory Management</div>
          <i className="bx bx-menu" id="btn" onClick={changeMenuBtn}></i>
        </div>
        <li>
          <i className="bx bx-search" onClick={changeMenuBtn}></i>
          <input type="text" placeholder="Search..." />
          <span className="tooltip">Search</span>
        </li>
        <li>
          <NavLink to="/dashboard" activeClassName="selected">
            <i className="bx bx-grid-alt"></i>
            <span className="links_name">Dashboard</span>
          </NavLink>
          <span className="tooltip">Dashboard</span>
        </li>
        {emulated_role === 0 ? (
          <>
            <li>
              <NavLink to="/shops" activeClassName="selected">
                <i className="bx bx-library"></i>
                <span className="links_name">Shops</span>
              </NavLink>
              <span className="tooltip">Shops</span>
            </li>
          </>
        ) : (
          ""
        )}

        {emulated_role === 1 ? (
          <>
            <li>
              <NavLink to="/inventory" activeClassName="selected">
                <i className="bx bx-library"></i>
                <span className="links_name">Inventory</span>
              </NavLink>
              <span className="tooltip">Inventory</span>
            </li>
            <li>
              <NavLink to="/transactions" activeClassName="selected">
                <i className="bx bx-sort-alt-2"></i>
                <span className="links_name">Transactions</span>
              </NavLink>
              <span className="tooltip">Transactions</span>
            </li>
            <li>
              <NavLink to="/payments" activeClassName="selected">
                <i className="bx bx-money"></i>
                <span className="links_name">Payments</span>
              </NavLink>
              <span className="tooltip">Payments</span>
            </li>
          </>
        ) : (
          ""
        )}
        {/* <li>
          <NavLink to="inventory" activeClassName="selected">
            <i className="bx bx-folder"></i>
            <span className="links_name">File Manager</span>
          </NavLink>
          <span className="tooltip">Files</span>
        </li>
        <li>
          <NavLink to="inventory" activeClassName="selected">
            <i className="bx bx-cart-alt"></i>
            <span className="links_name">Order</span>
          </NavLink>
          <span className="tooltip">Order</span>
        </li>
        <li>
          <NavLink to="inventory" activeClassName="selected">
            <i className="bx bx-heart"></i>
            <span className="links_name">Saved</span>
          </NavLink>
          <span className="tooltip">Saved</span>
        </li>
        <li>
          <NavLink to="inventory" activeClassName="selected">
            <i className="bx bx-cog"></i>
            <span className="links_name">Setting</span>
          </NavLink>
          <span className="tooltip">Setting</span>
        </li> */}
        {emulated_role === 1 && role === 0 ? (
          <li>
            <Button variant="outlined" color="secondary" onClick={logoutAsShop}>
              <span className="links_name">
                Logout as {user.shop_detail.name}
              </span>
            </Button>
            <span className="tooltip">Logout as {user.shop_detail.name}</span>
          </li>
        ) : (
          ""
        )}
        <li className="profile">
          <div className="profile-details">
            {/* <img src="profile.jpg" alt="profileImg"> */}
            <div className="name_job">
              <div className="name">
                <NavLink to="/profile" activeClassName="selected">
                  {user.first_name !== ""
                    ? `${user.first_name} ${user.last_name}`
                    : user.email}
                </NavLink>
              </div>
              <div className="job">Web designer</div>
            </div>
          </div>
          <NavLink to="/logout" activeClassName="selected">
            <i className="bx bx-log-out" id="log_out"></i>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SideNav;
