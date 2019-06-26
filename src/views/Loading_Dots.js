import React, { Component } from "react";
import loading_gif from "../assets/loading_gif_dots.gif";

class Loading_Dots extends Component {
  render() {
    return (
      <div
        className="text-center"
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <img src={loading_gif} width="126px" height="71px" />
      </div>
    );
  }
}

export default Loading_Dots;
