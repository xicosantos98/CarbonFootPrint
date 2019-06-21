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

const Loading = React.lazy(() => import("./Loading"));

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

class DynamicDialog extends React.Component {
  state = {
    selectedIndex: 0
  };

  handleClose = () => {
    if (this.props.data[this.state.selectedIndex]) {
      this.props.onClose(this.props.data[this.state.selectedIndex]["main"]);
    }
  };

  handleCancel = () => {
    this.props.onClose("");
  };

  handleListItemClick = (event, index) => {
    this.setState({ selectedIndex: index });
  };

  render() {
    const { classes, onClose, selectedValue, data, ...other } = this.props;
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
          <DialogTitle id="scroll-dialog-title">Products</DialogTitle>
          <DialogContent>
            {this.props.data && this.props.data.length != 0 ? (
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
                          viewBox="0 0 100 83.373"
                          style={{ fontSize: "1.7rem" }}
                        >
                          <path d="M83.685,27.454L100,18.392l-3.601-1.946L66.621,0.221L50.215,9.173L33.359,0L0,18.145l3.548,1.999l13.008,7.227L16.4,27.448  h-0.013v0.013l-16.1,8.77l16.1,8.652v21.752l33.607,16.738l33.613-16.738V44.948l16.23-8.717L83.685,27.454z M66.621,5.345  l24.036,13.08l-11.634,6.471l-24.31-13.053L66.621,5.345z M9.323,18.19L33.359,5.11l11.914,6.484L20.951,24.661L9.323,18.19z   M9.727,36.211l11.908-6.504l24.277,13.131l-11.875,6.419L9.727,36.211z M20.892,63.841v-16.53l13.184,7.083l13.672-7.591v30.41  L20.892,63.841z M79.114,63.841L52.259,77.207V46.751l13.75,7.643l13.105-7.031V63.841z M90.371,36.198l-24.316,13.06l-11.673-6.419  l24.062-13.131L90.371,36.198z" />
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
            ) : this.props.data && this.props.data.length == 0 ? (
              <p> 0 products found</p>
            ) : (
              <Loading />
            )}
          </DialogContent>
          <ListItem button>
            <ListItemAvatar>
              <Avatar className={classes.addAvatar}>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Create product" />
          </ListItem>
          <div style={{ paddingLeft: "26px" }}>
            <TextField
              id="outlined-number"
              label="Output quantity"
              helperText="Units"
              type="number"
              className={classes.textField}
              InputLabelProps={{
                shrink: true
              }}
              margin="normal"
              variant="outlined"
            />
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
