import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import {
  getPendingRequests,
  cancelRequest
} from "../../actions/requestsActions";
import DataTable from "../DataTable";
import BlockIcon from "@material-ui/icons/Close";
import AcceptIcon from "@material-ui/icons/Check";
import Error from "@material-ui/icons/ErrorOutline";
import Typography from "@material-ui/core/Typography";
import iziToast from "izitoast";

import { createOrganization } from "../../actions/organizationsActions";
import { Button } from "@material-ui/core";

const divError = {
  alignItems: "center",
  justifyContent: "center"
};

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
});
var columns = [4];

//var selectReq = null;

class Requests extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectReq: [],
      requests: []
    };

    this.updateSelectedList = this.updateSelectedList.bind(this);
  }

  showNotification(type, msg) {
    var color;

    if (type == "error") {
      color = "#ec644b";
    } else {
      color = "#4dbd74";
    }

    iziToast.show({
      title: "",
      position: "topRight",
      messageSize: 15,
      messageColor: "#fff",
      iconColor: "#fff",
      icon: "fa fa-exclamation-triangle",
      message: msg,
      color: color,
      maxWidth: 800,
      progressBarColor: "#fff"
    });
  }

  updateSelectedList = selected => {
    this.setState({ selectReq: selected });
  };

  acceptRequests = () => {
    for (var i = 0; i < this.state.selectReq.length; i++) {
      var body = {
        name: this.state.selectReq[i][0],
        desc: this.state.selectReq[i][1],
        barea: this.state.selectReq[i][2],
        email: this.state.selectReq[i][3],
        address: this.state.selectReq[i][4]
      };

      this.props.createOrganization(body, this.props.account).then(response => {
        if (response.valid) {
          this.showNotification("success", response.msg);
        } else {
          this.showNotification("error", response.msg);
        }

        this.props.getPendingRequests();
      });
    }
  };

  rejectRequests = () => {
    for (var i = 0; i < this.state.selectReq.length; i++) {
      var body = {
        org_name: this.state.selectReq[i][0]
      };

      this.props.cancelRequest(body, this.props.account).then(response => {
        if (response.valid) {
          this.showNotification("success", response.msg);
        } else {
          this.showNotification("error", response.msg);
        }

        this.props.getPendingRequests();
      });
    }
  };

  componentWillMount() {
    this.props.getPendingRequests();
  }

  render() {
    const { classes } = this.props;
    return this.props.pRequests.data && this.props.pRequests.data.length > 0 ? (
      <div>
        <DataTable
          data={this.props.pRequests.data}
          hideColumns={columns}
          name={"Requests"}
          updateSelectedList={this.updateSelectedList}
          selectionEnable={true}
        />
        <div className="row justify-content-end mt-5">
          <div className="col-12 col-md-2 text-right">
            <Button
              variant="contained"
              color="primary"
              style={{ textTransform: "none" }}
              fullWidth
              className={classes.button}
              onClick={this.acceptRequests}
              disabled={this.state.selectReq.length == 0}
            >
              <AcceptIcon className={classes.leftIcon} />
              Accept
            </Button>
          </div>
          <div className="col-12 col-md-2 text-right">
            <Button
              variant="contained"
              color="primary"
              style={{ textTransform: "none" }}
              fullWidth
              className={classes.button}
              onClick={this.rejectRequests}
              disabled={this.state.selectReq.length == 0}
            >
              <BlockIcon className={classes.leftIcon} />
              Reject
            </Button>
          </div>
        </div>
      </div>
    ) : (
      <div className="app" style={divError}>
        <Error style={{ width: 150, height: 150, color: "#0b5b3b" }} />
        <Typography variant="h5" gutterBottom style={{ color: "#0b5b3b" }}>
          No pending requests found !
        </Typography>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pRequests: state.requests.pendingRequests
});
export default connect(
  mapStateToProps,
  { getPendingRequests, createOrganization, cancelRequest }
)(withStyles(styles)(Requests));
