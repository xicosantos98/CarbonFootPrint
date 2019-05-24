import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";

const pageStyles = theme => ({
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
  iconButton: {
    padding: 10
  }
});

const divStyle = {
  alignItems: "center",
  justifyContent: "center"
};

class Details extends Component {
  state = {};

  render() {
    const { classes } = this.props;
    return (
      <div className="row justify-content-center mt-5">
        <div className="col-12 col-md-6 text-right">
          <Paper className={classes.root}>
            <InputBase
              className={classes.input}
              placeholder="Search for organization"
            />
            <IconButton className={classes.iconButton} aria-label="Search">
              <SearchIcon style={{ color: "#0b5b3b" }} />
            </IconButton>
          </Paper>
        </div>
      </div>
    );
  }
}

export default withStyles(pageStyles)(Details);
