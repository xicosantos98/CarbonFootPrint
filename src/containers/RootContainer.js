import React, { Component } from "react";
import { Provider } from "react-redux";

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
        <Provider store={store}>
          <App />
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default RootContainer;
