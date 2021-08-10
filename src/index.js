import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./themes/theme";
import allReducers from "./redux/reducers";
import { Provider as ReduxProvider } from "react-redux";
import { createStore } from "redux";
import { CssBaseline } from "@material-ui/core";
import "./App.css";

const store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
