import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { getUser } from "./actions/userActions";

// import { renderRoutes } from 'react-router-config';
import "./App.scss";
import Web3 from "web3";
import loading_gif from "./assets/loading.gif";

const loading = () => (
  <div
    className="app animated fadeIn pt-3 text-center"
    style={{
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <img src={loading_gif} width="200px" height="200px" />
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./containers/DefaultLayout"));

// Pages
const Metamask = React.lazy(() => import("./views/MetamaskNotFound"));
const GuestPage = React.lazy(() => import("./views/Guests/Guests"));

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: "0x0",
      web3: null,
      user: null,
      erroMessage: null
    };

    this.web3 = window.web3;
    var context = this;

    window.addEventListener("load", function() {
      if (
        typeof context.web3 !== "undefined" &&
        context.web3.currentProvider.isMetaMask
      ) {
        context.web3.eth.getAccounts(function(err, accounts) {
          if (err != null) console.error("An error occurred: " + err);
          else if (accounts.length === 0) {
            context.setState({ erroMessage: "User isn't logged in Metamask!" });
          } else {
            context.setState({ erroMessage: null });
          }
        });
      } else {
        context.setState({
          erroMessage: "Metamask not found, please install!"
        });
      }
    });

    if (typeof web3 !== "undefined") {
      this.web3Provider = this.web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
    }

    this.web3 = new Web3(this.web3Provider);

    var context = this;
    setInterval(function() {
      if (
        context.web3.eth.accounts[0] !== context.state.account &&
        (context.state.account != "0x0" || context.web3.eth.accounts[0])
      ) {
        window.location.reload();
      }
    }, 2000);
  }

  getAccount = () => {
    var context = this;
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts(async function(err, accounts) {
        if (err != null) console.error("An error occurred: " + err);
        else if (accounts.length === 0) {
          reject("No login");
        } else {
          context.setState({ account: accounts[0] });
          resolve(accounts[0]);
        }
      });
    });
  };

  async componentWillMount() {
    await this.getAccount().catch(function(error) {
      console.log(error);
    });

    this.props.getUser(this.state.account);
  }
  render() {
    const error = (
      <React.Suspense fallback={loading()}>
        <Metamask message={this.state.erroMessage} />
      </React.Suspense>
    );

    const guest = (
      <HashRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route
              path="/"
              name="HomeGuest"
              render={props => (
                <GuestPage {...props} account={this.state.account} />
              )}
            />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );

    if (this.props.user.data) {
      if (
        this.props.user &&
        this.props.user.data.type == "Admin" &&
        !this.state.erroMessage
      ) {
        return (
          <HashRouter>
            <React.Suspense fallback={loading()}>
              <Switch>
                <Route
                  path="/"
                  name="Home"
                  render={props => <DefaultLayout {...props} role="admin" />}
                />
              </Switch>
            </React.Suspense>
          </HashRouter>
        );
      } else if (this.state.account == "0x0" || this.state.erroMessage) {
        return error;
      } else {
        return guest;
      }
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => ({
  user: state.users.item
});

export default connect(
  mapStateToProps,
  { getUser }
)(App);
