import React, { Component, Suspense } from "react";
import { AppHeader } from "@coreui/react";
import { withStyles } from "@material-ui/core/styles";
import { HashRouter, Route, Switch } from "react-router-dom";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import InboxIcon from "@material-ui/icons/Inbox";
import Avatar from "@material-ui/core/Avatar";
import Business from "@material-ui/icons/Business";
import { Container } from "reactstrap";

// Containers
const DefaultLayout = React.lazy(() => import("./DefaultLayout/DefaultLayout"));

const DefaultHeader = React.lazy(() => import("./DefaultLayout/DefaultHeader"));

const headerStyle = {
  background: "#fff",
  textColor: "#ffffff"
};

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 300,
    marginTop: 20
  },
  textItem: {
    color: "#4caf50"
  }
});

class UserOrganizations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      choosedOrg: false,
      org: null,
      idOrg: null
    };
  }
  clickItem = (name, id) => {
    this.setState({ org: name });
    this.setState({ idOrg: id });
    this.setState({ choosedOrg: true });
  };

  render() {
    const { classes } = this.props;

    if (!this.state.choosedOrg) {
      return (
        <div className="app">
          <AppHeader fixed style={headerStyle}>
            <DefaultHeader onLogout={e => this.signOut(e)} role="guest" />
          </AppHeader>

          <div className="app-body">
            <main className="main" style={{ backgroundColor: "#e0fae1" }}>
              <Container fluid className="mt-3">
                <div className="text-center mt-5">
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ color: "#0b5b3b" }}
                  >
                    Please select a organization
                  </Typography>
                  <div className="container">
                    <div className="row justify-content-center">
                      <div className="col-6 text-center">
                        <div className={classes.root}>
                          <List component="nav" aria-label="Organizations">
                            {this.props.user.organizations.map((org, i) => (
                              <ListItem
                                key={i}
                                button
                                color="primary"
                                onClick={() => this.clickItem(org.name, org.id)}
                              >
                                <Avatar
                                  style={{
                                    backgroundColor: "#0b5b3b",
                                    marginRight: "10px"
                                  }}
                                >
                                  <Business />
                                </Avatar>
                                <ListItemText
                                  primary={
                                    <Typography
                                      variant="subtitle1"
                                      style={{ color: "#0b5b3b" }}
                                    >
                                      {org.name}
                                    </Typography>
                                  }
                                  secondary={org.business_area}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Container>
            </main>
          </div>
        </div>
      );
    } else {
      return (
        <HashRouter>
          <Switch>
            <Route
              path="/"
              name="Home"
              render={props => (
                <DefaultLayout
                  {...props}
                  role="admin_org"
                  org_name={this.state.org}
                  id_org={this.state.idOrg}
                />
              )}
            />
          </Switch>
        </HashRouter>
      );
    }
  }
}

export default withStyles(styles)(UserOrganizations);
