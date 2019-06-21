import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import DataTable from "../DataTable";
import { getMonthlyActivities } from "../../actions/organizationsActions";
import AddIcon from "@material-ui/icons/Add";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";
import Error from "@material-ui/icons/ErrorOutline";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";
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

moment.locale("pt");

const Loading = React.lazy(() => import("../../views/Loading"));

const divError = {
  alignItems: "center",
  justifyContent: "center"
};

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
    marginLeft: theme.spacing.unit
  },
  margin: {
    margin: theme.spacing.unit
  }
});

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#0b5b3b"
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#0b5b3b"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#4caf50"
      },
      "&:hover fieldset": {
        borderColor: "#0b5b3b"
      },
      "&.Mui-focused fieldset": {
        borderColor: "#0b5b3b"
      }
    }
  }
})(TextField);

class MActivity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectReq: [],
      startDate: moment("January 2019").format("MMMM YYYY"),
      endDate: moment().format("MMMM YYYY"),
      searchText: "",
      loading: true
    };

    this.updateSelectedList = this.updateSelectedList.bind(this);
  }

  componentWillMount() {
    this.props.getMonthlyActivities(this.props.id_org).then(res => {
      this.setState({ loading: false });
    });
  }

  getFilterData = () => {
    this.setState({ loading: true });
    this.props
      .getMonthlyActivities(this.props.id_org, this.state.searchText)
      .then(res => {
        this.setState({ loading: false });
      });
  };

  getFilterDataByDate = () => {
    this.setState({ loading: true });
    this.props
      .getMonthlyActivities(
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

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className="row justify-content-start">
          <div className="col-8 text-center">
            <Paper className={classes.root}>
              <InputBase
                className={classes.input}
                placeholder="(Product, Description)"
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
          {this.props.mActivities.length > 0 && !this.state.loading ? (
            <div className="col-12 text-center mb-4">
              <DataTable
                data={this.props.mActivities}
                name={"Monthly Activities"}
                updateSelectedList={this.updateSelectedList}
                selectionEnable={true}
                multipleSelectionEnable={false}
              />
            </div>
          ) : this.props.mActivities.length == 0 && !this.state.loading ? (
            <div className="col-12 text-center">
              <Error style={{ width: 150, height: 150, color: "#0b5b3b" }} />
              <Typography
                variant="h5"
                gutterBottom
                style={{ color: "#0b5b3b" }}
              >
                No monthly activities found !
              </Typography>
            </div>
          ) : (
            <Loading className={"mb-5"} />
          )}

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
            href="#/company/monthlyactivites/create"
          >
            <AddIcon className={classes.extendedIcon} />
          </Fab>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  mActivities: state.organizations.m_activities
});
export default connect(
  mapStateToProps,
  { getMonthlyActivities }
)(withStyles(styles)(MActivity));
