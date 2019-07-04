import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddIcon from "@material-ui/icons/Add";
import SvgIcon from "@material-ui/core/SvgIcon";
import TextField from "@material-ui/core/TextField";

import Loading_Dots from "../Loading_Dots";
import {
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import moment from "moment";
const styles = {
  avatar: {
    margin: 10
  },
  addAvatar: {
    margin: 10,
    color: "#fff",
    backgroundColor: "#0b5b3b"
  }
};

function findUnitType(unitType) {
  if (unitType.Type === this[0]) {
    return unitType;
  }
}

class DynamicDialog extends React.Component {
  state = {
    description: "",
    name: "",
    intermediate: false,
    dateSelected: moment(),
    co2eq: 0,
    unitTypeSelected: "",
    unitSelected: "",
    units: []
  };

  handleClose = () => {
    if (this.state.name !== "" && this.state.unitSelected !== "") {
      this.props.onClose(
        this.state.description,
        this.state.name,
        this.state.dateSelected.format("MMMM"),
        this.state.dateSelected.format("YYYY"),
        this.state.intermediate,
        this.state.co2eq,
        this.state.unitSelected
      );
    }
  };

  handleCancel = () => {
    this.props.onClose(null, null, null, null, null, null, null);
  };

  handleChangeUnitTypes = event => {
    this.setState({ unitTypeSelected: event.target.value });
    var unitType = this.props.unit_types.find(findUnitType, [
      event.target.value
    ]);
    this.setState({ units: unitType.Units }, () => {
      this.setState({ unitSelected: this.state.units[0][1] });
    });
  };

  handleChangeUnit = event => {
    this.setState({ unitSelected: event.target.value });
  };

  render() {
    const {
      classes,
      onClose,
      selectedValue,
      data,
      isloading,
      ...other
    } = this.props;

    return (
      <div>
        <Dialog
          onClose={this.handleCancel}
          aria-labelledby="simple-dialog-title"
          fullWidth={true}
          scroll="paper"
          maxWidth="sm"
          {...other}
        >
          <DialogTitle
            id="scroll-dialog-title"
            style={{ backgroundColor: "#0b5b3b", color: "#fff" }}
          >
            <SvgIcon
              fontSize="small"
              viewBox="0 0 42 42"
              style={{ fontSize: "1.2rem", marginRight: "5px" }}
            >
              <path
                d="M37.059,16H26V4.941C26,2.224,23.718,0,21,0s-5,2.224-5,4.941V16H4.941C2.224,16,0,18.282,0,21s2.224,5,4.941,5H16v11.059
	            C16,39.776,18.282,42,21,42s5-2.224,5-4.941V26h11.059C39.776,26,42,23.718,42,21S39.776,16,37.059,16z"
              />
            </SvgIcon>
            Create Product
          </DialogTitle>

          <DialogContent>
            {/* <div style={{ paddingLeft: "26px", display: "inline-flex" }}> */}
            <div className="row justify-content-center">
              <div className="col-6 text-center">
                <TextField
                  id="outlined-number"
                  label="Name"
                  value={this.state.name}
                  fullWidth
                  onChange={event =>
                    this.setState({ name: event.target.value })
                  }
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  margin="normal"
                  variant="outlined"
                />
              </div>
              {/* <div style={{ paddingLeft: "10px" }}> */}
              <div className="col-6 text-center">
                <TextField
                  id="outlined-number"
                  label="Description"
                  fullWidth
                  value={this.state.description}
                  onChange={event =>
                    this.setState({ description: event.target.value })
                  }
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  margin="normal"
                  variant="outlined"
                />
              </div>
            </div>
            <div className="row justify-content-center mt-3">
              <div className="col-6 text-center">
                <KeyboardDatePicker
                  variant="inline"
                  inputVariant="outlined"
                  InputAdornmentProps={{ position: "start" }}
                  label="Select Date"
                  value={this.state.dateSelected.format("MMMM YYYY")}
                  onChange={(date, x) => {
                    this.setState({ dateSelected: date });
                  }}
                  views={["year", "month"]}
                />
              </div>
              <div className="col-6 text-center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.intermediate}
                      onChange={event =>
                        this.setState({ intermediate: event.target.checked })
                      }
                      value="intermediate"
                      color="primary"
                    />
                  }
                  label="Intermediate product"
                />
              </div>
            </div>
            <div className="row justify-content-center mt-3">
              <div className="col-6 text-center">
                <TextField
                  id="outlined-number"
                  label="Product Footprint"
                  helperText="CO2eq"
                  fullWidth
                  type="number"
                  value={this.state.co2eq}
                  onChange={event =>
                    this.setState({ co2eq: event.target.value })
                  }
                  className={classes.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  margin="normal"
                  variant="outlined"
                />
              </div>
              <div className="col-6" />
            </div>
            <div className="row justify-content-center mt-3">
              <div className="col-6">
                <TextField
                  id="outlined-select-currency"
                  select
                  label="Unit type"
                  fullWidth
                  className={classes.textField}
                  value={this.state.unitTypeSelected}
                  onChange={this.handleChangeUnitTypes}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  helperText="Please select a unit type"
                  margin="normal"
                  variant="outlined"
                >
                  {this.props.unit_types
                    ? this.props.unit_types.map((unit, i) => (
                        <MenuItem key={i} value={unit.Type}>
                          {unit.Type}
                        </MenuItem>
                      ))
                    : null}
                </TextField>
              </div>
              <div className="col-6">
                <TextField
                  id="outlined-select-currency"
                  select
                  fullWidth
                  label="Unit"
                  className={classes.textField}
                  value={this.state.unitSelected}
                  onChange={this.handleChangeUnit}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  helperText="Please specify a unit"
                  margin="normal"
                  variant="outlined"
                >
                  {this.state.units
                    ? this.state.units.map((unit, i) => (
                        <MenuItem key={i} value={unit[0]}>
                          {unit[1]}
                        </MenuItem>
                      ))
                    : null}
                </TextField>
              </div>
            </div>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(DynamicDialog);
