import { combineReducers } from "redux";
import isAuthenticatedReducer from "./isAuthenticated";
import accessTokenReducer from "./accessToken";
import userInfoReducer from "./userInfo";

const AllReducers = combineReducers({
  authenticated: isAuthenticatedReducer,
  token: accessTokenReducer,
  user: userInfoReducer,
});

export default AllReducers;
