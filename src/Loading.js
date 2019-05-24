import React, { Component } from "react";
import loading_gif from "./loading.gif";

class Loading extends Component {
  render() {
    return (
      <div
        className="app animated fadeIn pt-3 text-center"
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <img src={loading_gif} width="128px" height="336px" />
      </div>
    );
  }
}

export default Loading;
