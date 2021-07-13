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
import ItemCreate from "../Components/inventory/ItemCreate";
import ItemCreateUpdate from "../Components/inventory/ItemCreateUpdate";
import AddTransaction from "../Components/transactions/AddTransaction";
import HeroMenu from "../Components/common/HeroMenu";

const Routes = ({ isAuthenticated }) => {
  return (
    <Router>
      {isAuthenticated ? "" : <Header />}
      <div className="main-body">
        <Switch>
          {isAuthenticated ? (
            <>
              <SideNav />
              <section className="home-section">
                <HeroMenu />
                <PrivateRoute exact path="/profile" component={MyAccount} />
                <PrivateRoute exact path="/inventory" component={Items} />
                <PrivateRoute
                  exact
                  path="/transactions"
                  component={Transactions}
                />
                <PrivateRoute exact path="/payments" component={Payments} />
                <PrivateRoute
                  path="/transactions/sell-stock"
                  component={AddTransaction}
                />
                <PrivateRoute
                  path="/transactions/add-stock"
                  component={AddTransaction}
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
