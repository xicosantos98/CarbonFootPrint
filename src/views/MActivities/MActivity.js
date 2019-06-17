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

const divError = {
  alignItems: "center",
  justifyContent: "center"
};

const styles = theme => ({
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  margin: {
    margin: theme.spacing.unit
  }
});

class MActivity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectReq: [],
      startDate: new Date(),
      endDate: new Date()
    };

    this.updateSelectedList = this.updateSelectedList.bind(this);
  }

  componentWillMount() {
    this.props.getMonthlyActivities(this.props.id_org);
  }

  updateSelectedList = selected => {
    this.setState({ selectReq: selected });
  };

  render() {
    const { classes } = this.props;

    return this.props.mActivities && this.props.mActivities.length > 0 ? (
      <div>
        <div className="row justify-content-start">
          <div className="col-9 text-center">
            <TextField
              id="outlined-dense"
              placeholder="(Product, Descrição)"
              fullWidth
              type="search"
              className={classes.dense}
              margin="dense"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </div>
        </div>
        <div className="row justify-content-start mt-5">
          <div className="col-3">
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
          <div className="col-3">
            <KeyboardDatePicker
              clearable
              label="Final Date"
              value={this.state.endDate}
              onChange={(event, x) => {
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
              className={classes.fab}
              style={{ top: "20%" }}
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

        <div className="row justify-content-end mt-5" />

        <div
          className="row justify-content-end mt-3"
          style={{ marginBottom: "4rem" }}
        >
          <div className="col-3 text-right">
            <Fab
              variant="extended"
              size="medium"
              color="primary"
              aria-label="Add"
              className={classes.margin}
              style={{ textTransform: "none" }}
            >
              <AddIcon className={classes.extendedIcon} />
              Create
            </Fab>
          </div>
          <div className="col-12 text-center">
            <DataTable
              data={this.props.mActivities}
              name={"Monthly Activities"}
              updateSelectedList={this.updateSelectedList}
              selectionEnable={true}
              multipleSelectionEnable={false}
            />
          </div>
        </div>
      </div>
    ) : (
      <div className="app" style={divError}>
        <Error style={{ width: 150, height: 150, color: "#0b5b3b" }} />
        <Typography variant="h5" gutterBottom style={{ color: "#0b5b3b" }}>
          No monthly activities found !
        </Typography>
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
