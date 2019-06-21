import React, { Component } from "react";
import { Provider } from "react-redux";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";

import App from "../App";

import store from "../store";

import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#4caf50",
      dark: "#0b5b3b",
      contrastText: "#fff"
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000"
    },
    typography: {
      useNextVariants: true
    }
  }
});

class RootContainer extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider
          utils={MomentUtils}
          moment={moment}
          locale="pt"
        >
          <Provider store={store}>
            <App />
          </Provider>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    );
  }
}

export default RootContainer;
