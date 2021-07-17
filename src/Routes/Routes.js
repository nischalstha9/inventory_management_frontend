import PrivateRoute from "../Routes/PrivateRoute";
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import Header from "../Components/common/Header";
import Footer from "../Components/common/Footer";
import Login from "../Components/auth/Login";
import Logout from "../Components/auth/Logout";
import Register from "../Components/auth/Register";
import ChangePassword from "../Components/auth/ChangePassword";
import MyAccount from "../Components/auth/MyAccount";
import ForgetPassword from "../Components/auth/ForgetPassword";
import ForgetPasswordTokenConfirm from "../Components/auth/ForgetPasswordTokenConfirm";
import RegisterTokenConfirm from "../Components/auth/RegisterTokenConfirm";
import NotFound from "../Components/common/NotFound";
import Items from "../Components/inventory/Items";
import Transactions from "../Components/transactions/Tranasactions";
import Payments from "../Components/payment/Payments";
import SideNav from "../Components/common/SideNav";
import ItemCreateUpdate from "../Components/inventory/ItemCreateUpdate";
import AddTransaction from "../Components/transactions/AddTransaction";
import UpdateTransaction from "../Components/transactions/UpdateTransaction";
import HeroMenu from "../Components/common/HeroMenu";
import Shops from "../Components/Shops";
import { useSelector } from "react-redux";

const Routes = ({ isAuthenticated }) => {
  const role = useSelector((state) => state.user.role);
  return (
    <Router>
      {isAuthenticated ? "" : <Header />}
      <div className="main-body">
        <Switch>
          {isAuthenticated ? (
            <>
              <SideNav />
              <section className="home-section">
                {role === 1 ? <HeroMenu /> : ""}
                <PrivateRoute exact path="/shops" component={Shops} />
                <PrivateRoute exact path="/profile" component={MyAccount} />
                <PrivateRoute exact path="/inventory" component={Items} />
                <PrivateRoute
                  exact
                  path="/transactions"
                  component={Transactions}
                />
                <PrivateRoute
                  exact
                  path="/transactions/:trans_id/update"
                  component={UpdateTransaction}
                />
                <PrivateRoute exact path="/payments" component={Payments} />
                <PrivateRoute
                  path="/transactions/sell-stock"
                  component={() => <AddTransaction mode="STOCK_OUT" />}
                />
                <PrivateRoute
                  path="/transactions/add-stock"
                  component={() => <AddTransaction mode="STOCK_IN" />}
                />
                <PrivateRoute
                  path="/inventory/new"
                  component={ItemCreateUpdate}
                />
                <PrivateRoute
                  path="/inventory/item/:item_id/edit"
                  component={ItemCreateUpdate}
                />
                <PrivateRoute
                  exact
                  path="/change-password"
                  component={ChangePassword}
                />
                <Route exact path="/logout" component={Logout} />
              </section>
            </>
          ) : (
            ""
          )}
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />

          <Route exact path="/">
            {isAuthenticated ? (
              <Redirect to="/dashboard" />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>

          <Route exact path="/forget-password" component={ForgetPassword} />
          <Route
            exact
            path="/password-token-confirm"
            component={ForgetPasswordTokenConfirm}
          />
          <Route exact path="/activate" component={RegisterTokenConfirm} />
          <Route component={NotFound} />
        </Switch>
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export default Routes;
