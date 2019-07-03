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
import { InputLabel, Select, MenuItem } from "@material-ui/core";
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
    selectedIndex: 0,
    description: "",
    dateSelected: moment(),
    quantity: 0
  };

  handleClose = () => {
    if (this.props.data[this.state.selectedIndex]) {
      this.props.onClose(
        this.props.data[this.state.selectedIndex],
        this.state.dateSelected.format("MMMM"),
        this.state.dateSelected.format("YYYY"),
        this.state.description,
        this.state.quantity
      );
    }
  };

  handleCancel = () => {
    this.props.onClose("");
  };

  handleListItemClick = (event, index) => {
    this.setState({ selectedIndex: index });
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
          onClose={this.handleClose}
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
            Create Monthly Fix Cost
          </DialogTitle>

          <DialogContent>
            {!isloading ? (
              this.props.data && this.props.data.length != 0 ? (
                <List component="nav">
                  {data.map((prod, i) => (
                    <ListItem
                      button
                      selected={this.state.selectedIndex == i}
                      onClick={event => this.handleListItemClick(event, i)}
                      key={i}
                    >
                      <ListItemAvatar>
                        <Avatar className={classes.avatar}>
                          <SvgIcon
                            fontSize="small"
                            viewBox="0 0 401.987 401.987"
                            style={{ fontSize: "1.5rem", marginRight: "5px" }}
                          >
                            <path
                              d="M345.176,382.016l-9.996-45.392c-0.567-2.669-1.995-4.668-4.284-5.995c-2.475-1.335-4.948-1.52-7.42-0.568l-1.43,0.568
		l-3.43,0.855c-1.525,0.376-3.285,0.808-5.283,1.283c-1.999,0.476-4.326,0.948-6.995,1.427c-2.655,0.476-5.476,0.907-8.419,1.287
		c-2.949,0.373-6.132,0.712-9.561,0.999c-3.43,0.281-6.852,0.425-10.281,0.425c-24.174,0-45.922-6.517-65.239-19.555
		c-19.32-13.042-33.548-30.696-42.683-52.961h110.486c2.098,0,4.001-0.712,5.708-2.143c1.719-1.424,2.766-3.183,3.139-5.284
		l6.852-31.977c0.574-2.847,0-5.42-1.708-7.706c-1.903-2.286-4.288-3.43-7.139-3.43h-131.04c-0.571-12.942-0.571-22.934,0-29.978
		h139.325c5.144,0,8.186-2.472,9.137-7.421l6.852-32.548c0.567-2.664-0.089-5.136-1.999-7.422c-1.707-2.284-4.086-3.431-7.132-3.431
		h-133.62c9.517-21.317,23.791-38.066,42.827-50.248c19.034-12.185,40.542-18.274,64.524-18.274c0.764-0.38,3.569-0.284,8.419,0.286
		c4.853,0.568,7.618,0.808,8.281,0.712c0.657-0.094,3.142,0.193,7.42,0.855c4.284,0.666,6.427,1,6.427,1l4.996,0.998
		c1.431,0.288,2.525,0.522,3.285,0.715l1.143,0.284c2.472,0.765,4.75,0.525,6.852-0.711c2.095-1.241,3.429-3.094,4.001-5.568
		l12.278-45.395c0.568-2.475,0.28-4.759-0.855-6.852c-1.715-2.288-3.621-3.715-5.715-4.284C315.39,2.19,296.92,0,277.51,0
		c-42.641,0-80.751,12.185-114.347,36.545c-33.595,24.362-56.77,56.532-69.523,96.501H65.663c-2.666,0-4.853,0.855-6.567,2.568
		c-1.709,1.711-2.568,3.901-2.568,6.567v32.548c0,2.664,0.856,4.854,2.568,6.563c1.715,1.715,3.905,2.568,6.567,2.568h19.13
		c-0.575,9.139-0.666,19.126-0.288,29.981H65.663c-2.474,0-4.615,0.903-6.423,2.711c-1.807,1.807-2.712,3.949-2.712,6.42v32.264
		c0,2.478,0.905,4.613,2.712,6.427c1.809,1.808,3.949,2.704,6.423,2.704h27.124c11.991,42.064,34.643,75.52,67.952,100.357
		c33.311,24.846,72.235,37.261,116.771,37.261c3.62,0,7.282-0.089,10.995-0.287c3.72-0.191,7.187-0.479,10.424-0.855
		c3.234-0.377,6.424-0.801,9.565-1.28c3.138-0.479,5.995-0.947,8.562-1.431c2.57-0.472,4.997-0.947,7.279-1.42
		c2.286-0.482,4.332-0.999,6.143-1.574c1.807-0.564,3.323-0.996,4.565-1.276c1.239-0.287,2.238-0.626,2.994-0.999l1.431-0.288
		c2.095-0.76,3.713-2.142,4.853-4.144C345.464,386.444,345.744,384.299,345.176,382.016z"
                            />
                          </SvgIcon>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={prod.main}
                        secondary={prod.secondary}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <p> 0 cost types found</p>
              )
            ) : (
              <Loading_Dots />
            )}
          </DialogContent>
          <div style={{ paddingLeft: "26px", display: "inline-flex" }}>
            <div>
              <TextField
                id="outlined-number"
                label="Quantity"
                type="number"
                value={this.state.quantity}
                onChange={event =>
                  this.setState({ quantity: event.target.value })
                }
                className={classes.textField}
                InputLabelProps={{
                  shrink: true
                }}
                margin="normal"
                variant="outlined"
              />
            </div>
            <div style={{ paddingLeft: "10px" }}>
              <TextField
                id="outlined-number"
                label="Description"
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
          <div style={{ paddingLeft: "26px", display: "inline-flex" }}>
            <div style={{ paddingLeft: "10px" }}>
              <KeyboardDatePicker
                clearable
                label="Select Date"
                value={this.state.dateSelected.format("MMMM YYYY")}
                onChange={(date, x) => {
                  this.setState({ dateSelected: date });
                }}
                views={["year", "month"]}
              />
            </div>
          </div>

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
