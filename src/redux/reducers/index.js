import { combineReducers } from "redux";
import isAuthenticatedReducer from "./isAuthenticated";
// import accessTokenReducer from "./accessToken";
import userInfoReducer from "./userInfo";
import roleReducer from "./roleReducer";
// import alertsReducer from "./alerts";

const allReducers = combineReducers({
  authenticated: isAuthenticatedReducer,
  role: roleReducer,
  // token: accessTokenReducer,
  user: userInfoReducer,
  // alerts: alertsReducer,
});

export default allReducers;
