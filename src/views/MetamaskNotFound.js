import React, { Component } from "react";
import metamask_logo from "../assets/metamask_logo.png";

const divStyle = {
  backgroundColor: "#4caf50",
  alignItems: "center",
  justifyContent: "center"
};

class MetamaskNotFound extends Component {
  render() {
    return (
      <div className="app" style={divStyle}>
        <img
          src={metamask_logo}
          alt="logo"
          width="150px"
          height="150px"
          style={{ marginBottom: "10px" }}
        />
        <p className="mt-2" style={{ color: "#fff", fontSize: "2em" }}>
          {" "}
          {this.props.message}{" "}
        </p>
        <div>
          {this.props.message === "Metamask not found, please install!" ? (
            <a
              className="mt-2"
              style={{ color: "#d6f8d4", fontSize: "1.5em" }}
              href="https://metamask.io/"
              target="blank"
            >
              https://metamask.io
            </a>
          ) : null}
        </div>
      </div>
    );
  }
}

export default MetamaskNotFound;
