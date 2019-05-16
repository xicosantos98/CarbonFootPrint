import React, { Component, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import { AppHeader } from "@coreui/react";

// routes config
import routes from "../../routes_guest";

const DefaultHeader = React.lazy(() =>
  import("../../containers/DefaultLayout/DefaultHeader")
);

const headerStyle = {
  background: "#fff",
  textColor: "#ffffff"
};

class Guests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingReg: null
    };
  }

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  render() {
    return (
      <div className="app">
        <AppHeader fixed style={headerStyle}>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={e => this.signOut(e)} role="guest" />
          </Suspense>
        </AppHeader>

        <div className="app-body">
          <main className="main" style={{ backgroundColor: "#e0fae1" }}>
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
                  <Redirect from="/" to="/guest/" />
                </Switch>
              </Suspense>
            </Container>
          </main>
        </div>
      </div>
    );
  }
}

export default Guests;
