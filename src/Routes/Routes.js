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

const Routes = ({ isAuthenticated }) => {
  return (
    <Router>
      <Header />
      <div className="main-body">
        <Switch>
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />

          <Route exact path="/">
            {isAuthenticated ? <Redirect to="/" /> : <Redirect to="/login" />}
          </Route>
          <PrivateRoute exact path="/profile" component={MyAccount} />
          <PrivateRoute
            exact
            path="/change-password"
            component={ChangePassword}
          />
          <Route exact path="/forget-password" component={ForgetPassword} />
          <Route
            exact
            path="/password-token-confirm"
            component={ForgetPasswordTokenConfirm}
          />
          <Route exact path="/activate" component={RegisterTokenConfirm} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </Router>
  );
};

export default Routes;
