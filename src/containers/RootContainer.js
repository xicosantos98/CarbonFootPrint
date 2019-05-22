import React, { Component } from "react";
import { Provider } from "react-redux";

import App from "../App";

import store from "../store";

class RootContainer extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

export default RootContainer;
