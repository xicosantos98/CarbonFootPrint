import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
// import { renderRoutes } from 'react-router-config';
import "./App.scss";
import Web3 from "web3";
import axios from "axios";

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./containers/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/Pages/Login"));
const Register = React.lazy(() => import("./views/Pages/Register"));
const Page404 = React.lazy(() => import("./views/Pages/Page404"));
const Page500 = React.lazy(() => import("./views/Pages/Page500"));
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

  loadUser = account => {
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:3000/api/v1/users/" + account)
        .then(function(response) {
          resolve(response);
        })
        .catch(function(error) {
          reject(error);
          return;
        });
    });
  };

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
    console.log(this.state.account);
    let u = await this.loadUser(this.state.account);
    this.setState({ user: u });
  }
  render() {
    /*this.web3.eth.getAccounts(function(err, accounts) {
      if (err != null) console.error("An error occurred: " + err);
      else if (accounts.length === 0) {
        console.log("No login");
      } else {
        console.log(accounts);
      }
    });*/

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
              render={props => <GuestPage {...props} />}
            />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );

    if (this.state.user) {
      console.log(this.state.user.data);
    }

    if (
      this.state.user &&
      this.state.user.data.type == "Admin" &&
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
      console.log(this.state.user, this.state.account, this.state.erroMessage);
      return error;
    } else {
      return guest;
    }
  }
}

export default App;
