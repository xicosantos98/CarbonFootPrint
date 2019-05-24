import React, { Component, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

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

import { connect } from "react-redux";
import { getPendingRequests } from "../../actions/requestsActions";
import loading_gif from "../../assets/loading.gif";

const DefaultAside = React.lazy(() => import("./DefaultAside"));
const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));
const Loading = React.lazy(() => import("../../views/Loading"));

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

  componentWillMount() {
    this.props.getPendingRequests();
  }

  signOut(e) {
    e.preventDefault();
    this.props.history.push("/login");
  }

  render() {
    if (this.props.pendingRequests.data) {
      return (
        <div className="app">
          <AppHeader fixed style={headerStyle}>
            <Suspense fallback={<Loading />}>
              <DefaultHeader
                onLogout={e => this.signOut(e)}
                role={this.props.role}
                pending_count={this.props.pendingRequests.data.length}
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
              <Container fluid className="mt-3">
                <Suspense fallback={<Loading />}>
                  <Switch>
                    {routes.map((route, idx) => {
                      return route.component ? (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={props => (
                            <route.component
                              {...props}
                              account={this.props.account}
                            />
                          )}
                        />
                      ) : null;
                    })}
                    <Redirect from="/" to="/dashboard" />
                  </Switch>
                </Suspense>
              </Container>
            </main>
            <AppAside fixed>
              <Suspense>
                <DefaultAside />
              </Suspense>
            </AppAside>
          </div>
        </div>
      );
    } else {
      return <Loading />;
    }
  }
}

const mapStateToProps = state => ({
  pendingRequests: state.requests.pendingRequests
});

export default connect(
  mapStateToProps,
  { getPendingRequests }
)(DefaultLayout);
