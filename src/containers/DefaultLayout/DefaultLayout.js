import React, { Component, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import axios from "axios";

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav
} from "@coreui/react";
// sidebar nav config
import navigation from "../../_nav";
// routes config
import routes from "../../routes";

const DefaultAside = React.lazy(() => import("./DefaultAside"));
const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

const headerStyle = {
  background: "#fff",
  textColor: "#ffffff"
};

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingReg: null
    };
  }

  loadPendingReq = () => {
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:3000/api/v1/requests/pending")
        .then(function(response) {
          resolve(response);
        })
        .catch(function(error) {
          reject(error);
          return;
        });
    });
  };

  async componentWillMount() {
    let pending = await this.loadPendingReq();
    this.setState({ pendingReg: pending });
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  signOut(e) {
    e.preventDefault();
    this.props.history.push("/login");
  }

  render() {
    if (this.state.pendingReg) {
      console.log("COUNT:" + this.state.pendingReg);
    }

    return (
      <div className="app">
        <AppHeader fixed style={headerStyle}>
          <Suspense fallback={this.loading()}>
            <DefaultHeader
              onLogout={e => this.signOut(e)}
              role={this.props.role}
              pending_count={
                this.state.pendingReg ? this.state.pendingReg.data.length : 0
              }
            />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={navigation} {...this.props} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main" style={{ backgroundColor: "#e0fae1" }}>
            {/* <AppBreadcrumb appRoutes={routes} /> */}
            <Container fluid className="mt-3">
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => <route.component {...props} />}
                      />
                    ) : null;
                  })}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
