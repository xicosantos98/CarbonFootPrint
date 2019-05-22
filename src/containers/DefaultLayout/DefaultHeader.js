import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Button,
  NavItem
} from "reactstrap";
import PropTypes from "prop-types";

import {
  AppAsideToggler,
  AppHeaderDropdown,
  AppNavbarBrand,
  AppSidebarToggler
} from "@coreui/react";
import logo from "../../assets/logo.png";
import logo_user from "../../assets/user.png";

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  renderUserOpts = () => {
    if (this.props.role == "admin") {
      return (
        <AppHeaderDropdown direction="down">
          <DropdownToggle nav>
            <img
              style={{ background: "white", padding: "5px" }}
              src={logo_user}
              className="img-avatar"
            />
          </DropdownToggle>
          <DropdownMenu right style={{ right: "auto" }}>
            <DropdownItem href="#/theme/colors">
              <i className="fa fa-bell-o" /> Requests
              {this.props.pending_count == 0 ? null : (
                <Badge color="success">{this.props.pending_count}</Badge>
              )}
            </DropdownItem>
            <DropdownItem onClick={e => this.props.onLogout(e)}>
              <i className="fa fa-lock" /> Logout
            </DropdownItem>
          </DropdownMenu>
        </AppHeaderDropdown>
      );
    } else if (this.props.role == "guest") {
      return (
        <Button
          block
          color="ghost-success"
          className="mr-3"
          href="#/guest/newRequest"
        >
          <i className="fa fa-plus" />
          &nbsp;New organization
        </Button>
      );
    } else {
      return null;
    }
  };

  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    return (
      <React.Fragment>
        {this.props.role != "guest" ? (
          <AppSidebarToggler
            className="d-lg-none text-white"
            display="md"
            mobile
          />
        ) : null}

        <AppNavbarBrand
          full={{ src: logo, width: 135, height: 45, alt: "CoreUI Logo" }}
        />
        {this.props.role != "guest" ? (
          <AppSidebarToggler className="d-md-down-none" display="lg" />
        ) : null}

        <Nav className="ml-auto" navbar>
          {this.renderUserOpts()}
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
