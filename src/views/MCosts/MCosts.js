import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import DataTable from "../DataTable";
import { getMonthlyCosts } from "../../actions/organizationsActions";
import AddIcon from "@material-ui/icons/Add";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";
import Error from "@material-ui/icons/ErrorOutline";
import Typography from "@material-ui/core/Typography";
import { Button, Tooltip } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { DatePicker, KeyboardDatePicker } from "@material-ui/pickers";
import Icon from "@material-ui/core/Icon";
import Fab from "@material-ui/core/Fab";
import SvgIcon from "@material-ui/core/SvgIcon";
import moment from "moment";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import { getCostTypes } from "../../actions/costTypesActions";
import { createFixCost } from "../../actions/organizationsActions";
import iziToast from "izitoast";

moment.locale("pt");

const Loading = React.lazy(() => import("../../views/Loading"));

const DialogCreate = React.lazy(() => import("./DialogCreate"));

const styles = theme => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  input: {
    marginLeft: 20,
    flex: 1
  },
  select: {
    marginRight: 5
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  margin: {
    margin: theme.spacing(1)
  }
});

class MCosts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectReq: [],
      startDate: moment("January 2019").format("MMMM YYYY"),
      endDate: moment().format("MMMM YYYY"),
      searchText: "",
      loading: true,
      loadingModal: true,
      openCreateModal: false,
      costArray: []
    };

    this.updateSelectedList = this.updateSelectedList.bind(this);
  }

  componentWillMount() {
    this.props.getMonthlyCosts(this.props.id_org).then(res => {
      this.setState({ loading: false });
    });
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

  getFilterData = () => {
    this.setState({ loading: true });
    this.props
      .getMonthlyCosts(this.props.id_org, this.state.searchText)
      .then(res => {
        this.setState({ loading: false });
      });
  };

  getFilterDataByDate = () => {
    this.setState({ loading: true });
    this.props
      .getMonthlyCosts(
        this.props.id_org,
        null,
        this.state.startDate,
        this.state.endDate
      )
      .then(res => {
        this.setState({ loading: false });
      });
  };

  enterSearch = event => {
    var code = event.keyCode ? event.keyCode : event.which;
    if (code == 13) {
      this.getFilterData();
    }
  };

  updateSelectedList = selected => {
    this.setState({ selectReq: selected });
  };

  openModalCreate = () => {
    this.props.getCostTypes().then(res => {
      var new_array = this.props.cost_types.data.map(cost => ({
        id: cost.id,
        main: cost.description,
        secondary: cost.unit
      }));
      this.setState({ costArray: new_array }, () => {
        this.setState({ loadingModal: false });
      });
    });
    this.setState({
      openCreateModal: true
    });
  };

  closeModalCreate = (type, month, year, description, quantity) => {
    if (type != null) {
      var body = {
        description: description,
        quantity: quantity,
        month: month,
        cost_type: type.id,
        organization: this.props.id_org,
        year: year
      };

      this.props.createFixCost(body, this.props.account).then(response => {
        if (response.valid) {
          this.showNotification("success", "Monthly fix cost created !");
          this.setState(
            { loadingModal: true, openCreateModal: false, loading: true },
            () => {
              this.props.getMonthlyCosts(this.props.id_org).then(res => {
                this.setState({ loading: false });
              });
            }
          );
        } else {
          this.showNotification("error", response.msg);
        }
      });
    } else {
      this.setState({ openCreateModal: false });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className="row justify-content-start">
          <div className="col-8 text-center">
            <Paper className={classes.root}>
              <InputBase
                className={classes.input}
                placeholder="(Description)"
                value={this.state.searchText}
                onKeyPress={this.enterSearch}
                onChange={event =>
                  this.setState({ searchText: event.target.value })
                }
              />
              <Divider className={classes.divider} />

              <IconButton
                className={classes.iconButton}
                aria-label="Search"
                onClick={this.getFilterData}
              >
                <SearchIcon style={{ color: "#0b5b3b" }} />
              </IconButton>
            </Paper>
            <DialogCreate
              open={this.state.openCreateModal}
              onClose={this.closeModalCreate}
              data={this.state.costArray}
              isloading={this.state.loadingModal}
            />
          </div>
        </div>
        <div
          className="row justify-content-start mt-5"
          style={{ marginBottom: "4rem" }}
        >
          <div className="col-8 row">
            <div className="col-4">
              <KeyboardDatePicker
                clearable
                label="Inicial Date"
                value={this.state.startDate}
                onChange={(event, x) => {
                  this.setState({ startDate: x });
                }}
                views={["year", "month"]}
              />
            </div>
            <div className="col-4">
              <KeyboardDatePicker
                clearable
                label="Final Date"
                value={this.state.endDate}
                minDate={this.state.startDate}
                onChange={(date, x) => {
                  this.setState({ endDate: x });
                }}
                views={["year", "month"]}
              />
            </div>
            <div className="col-1">
              <Fab
                color="primary"
                size="small"
                aria-label="Add"
                style={{ top: "20%" }}
                onClick={this.getFilterDataByDate}
              >
                <SvgIcon
                  fontSize="small"
                  viewBox="0 0 512 512"
                  style={{ fontSize: "1rem" }}
                >
                  <path d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z" />
                </SvgIcon>
              </Fab>
            </div>
          </div>
        </div>

        <div className="row justify-content-center mt-3">
          {this.props.mCosts.length > 0 && !this.state.loading ? (
            <div className="col-12 text-center mb-4">
              <DataTable
                data={this.props.mCosts}
                name={"Monthly Fix Costs"}
                updateSelectedList={this.updateSelectedList}
                selectionEnable={false}
                multipleSelectionEnable={false}
              />
            </div>
          ) : this.props.mCosts.length == 0 && !this.state.loading ? (
            <div className="col-12 text-center">
              <Error style={{ width: 150, height: 150, color: "#0b5b3b" }} />
              <Typography
                variant="h5"
                gutterBottom
                style={{ color: "#0b5b3b" }}
              >
                No monthly fix costs found !
              </Typography>
            </div>
          ) : (
            <Loading className={"mb-5"} />
          )}
          <Tooltip title="Create fix cost">
            <Fab
              color="primary"
              aria-label="Add"
              className={classes.fab}
              style={{
                textTransform: "none",
                position: "fixed",
                bottom: "20px",
                right: "20px"
              }}
              onClick={this.openModalCreate}
            >
              <AddIcon
                style={{ textTransform: "none" }}
                className={classes.extendedIcon}
              />
            </Fab>
          </Tooltip>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  mCosts: state.organizations.m_fix_costs,
  cost_types: state.cost_types.costTypes
});
export default connect(
  mapStateToProps,
  { getMonthlyCosts, getCostTypes, createFixCost }
)(withStyles(styles)(MCosts));
