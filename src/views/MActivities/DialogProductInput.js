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
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import CheckIcon from "@material-ui/icons/Check";
import UncheckIcon from "@material-ui/icons/Close";
import SvgIcon from "@material-ui/core/SvgIcon";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  //ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
  RadioGroup,
  FormControlLabel,
  Radio,
  TableCell,
  TablePagination,
  TableBody,
  IconButton,
  Tooltip
} from "@material-ui/core";
import Loading_Dots from "../Loading_Dots";

//const Loading = React.lazy(() => import("../Loading"));
/* #region  Styles */

const styles = theme => ({
  avatar: {
    margin: 10
  },
  addAvatar: {
    margin: 10,
    color: "#fff",
    backgroundColor: "#0b5b3b"
  },
  rootTable: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
    marginBottom: theme.spacing(4)
  },
  iconTable: {
    padding: "5px"
  }
});

const ExpansionPanel = withStyles({
  root: {
    border: "none",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      margin: "auto"
    }
  },
  expanded: {}
})(MuiExpansionPanel);

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "#f2f1ef",
    color: theme.palette.common.black
  },
  body: {
    fontSize: 14
  }
}))(TableCell);
/* #endregion */

class DialogProductInput extends React.Component {
  state = {
    selectedIndex: null,
    selectedFilter: "own_org",
    page: 0,
    rowsPerPage: 5
  };

  handleClose = () => {
    if (this.props.data[this.state.selectedIndex]) {
      this.props.onClose(this.props.data[this.state.selectedIndex]);
      this.setState({ selectedIndex: null });
      this.setState({ selectedFilter: "own_org" });
    }
  };

  handleCancel = () => {
    this.props.onClose("");
    this.setState({ selectedIndex: null });
    this.setState({ selectedFilter: "own_org" });
  };

  handleListItemClick = (event, index) => {
    this.setState({ selectedIndex: index });
  };

  handleFilterChange = event => {
    this.setState({ selectedFilter: event.target.value }, () => {
      this.props.onFilterChange(this.state.selectedFilter);
    });
  };

  /* #region  Handlers tabelas */
  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  /* #endregion */

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
          //onClose={this.handleClose}
          aria-labelledby="simple-dialog-title"
          fullWidth={true}
          scroll="paper"
          maxWidth="md"
          onClose={this.handleClose}
          {...other}
        >
          <DialogTitle
            id="scroll-dialog-title"
            style={{ backgroundColor: "#0b5b3b", color: "#fff" }}
          >
            <SvgIcon
              fontSize="small"
              viewBox="0 0 100 83.373"
              style={{ fontSize: "1.7rem", marginRight: "5px" }}
            >
              <path d="M83.685,27.454L100,18.392l-3.601-1.946L66.621,0.221L50.215,9.173L33.359,0L0,18.145l3.548,1.999l13.008,7.227L16.4,27.448  h-0.013v0.013l-16.1,8.77l16.1,8.652v21.752l33.607,16.738l33.613-16.738V44.948l16.23-8.717L83.685,27.454z M66.621,5.345  l24.036,13.08l-11.634,6.471l-24.31-13.053L66.621,5.345z M9.323,18.19L33.359,5.11l11.914,6.484L20.951,24.661L9.323,18.19z   M9.727,36.211l11.908-6.504l24.277,13.131l-11.875,6.419L9.727,36.211z M20.892,63.841v-16.53l13.184,7.083l13.672-7.591v30.41  L20.892,63.841z M79.114,63.841L52.259,77.207V46.751l13.75,7.643l13.105-7.031V63.841z M90.371,36.198l-24.316,13.06l-11.673-6.419  l24.062-13.131L90.371,36.198z" />
            </SvgIcon>
            Input Products
          </DialogTitle>
          <DialogContent>
            <div className="row justify-content-start text-center">
              <div className="col-8">
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    style={{ flexGrow: 0.25, justifyContent: "start" }}
                  >
                    <Typography variant="subtitle1">
                      <i
                        className="fas fa-filter"
                        style={{ color: "#0b5b3b", marginRight: "10px" }}
                      />
                      Filter
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <RadioGroup
                      aria-label="Filter Options"
                      name="filter"
                      value={this.state.selectedFilter}
                      onChange={this.handleFilterChange}
                      style={{ flexDirection: "row" }}
                    >
                      <FormControlLabel
                        value="own_org"
                        control={<Radio color="primary" />}
                        label="Own Organization"
                      />
                      <FormControlLabel
                        value="external"
                        control={<Radio color="primary" />}
                        label="External"
                      />
                    </RadioGroup>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>
            </div>
            {!isloading ? (
              this.props.data && this.props.data.length != 0 ? (
                <div className="row justify-content-start text-center">
                  <div className="col-12">
                    <Paper className={classes.rootTable}>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Input Product</StyledTableCell>
                            <StyledTableCell align="right">
                              Year
                            </StyledTableCell>
                            <StyledTableCell> Month </StyledTableCell>
                            <StyledTableCell>Organization</StyledTableCell>
                            <StyledTableCell align="right">
                              CO2eq
                            </StyledTableCell>
                            <StyledTableCell align="right" />
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.map((row, i) => (
                            <TableRow key={i}>
                              <TableCell component="th" scope="row">
                                {row.product}
                              </TableCell>
                              <TableCell align="right">{row.year}</TableCell>
                              <TableCell>{row.month}</TableCell>
                              <TableCell>{row.organization}</TableCell>
                              <TableCell align="right">{row.CO2eq}</TableCell>
                              <TableCell align="right">
                                <Tooltip
                                  title={
                                    this.state.selectedIndex == i
                                      ? "Deselect"
                                      : "Select"
                                  }
                                >
                                  <IconButton
                                    className={classes.iconTable}
                                    aria-label="Search"
                                    onClick={event => {
                                      if (this.state.selectedIndex == i) {
                                        this.setState({ selectedIndex: null });
                                      } else {
                                        this.setState({ selectedIndex: i });
                                      }
                                    }}
                                    style={
                                      this.state.selectedIndex == i
                                        ? { backgroundColor: "#0b5b3b" }
                                        : { backgroundColor: "#fff" }
                                    }
                                  >
                                    {this.state.selectedIndex == i ? (
                                      <CheckIcon style={{ color: "#fff" }} />
                                    ) : (
                                      <CheckIcon />
                                    )}
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={this.props.data.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        backIconButtonProps={{
                          "aria-label": "Previous Page"
                        }}
                        nextIconButtonProps={{
                          "aria-label": "Next Page"
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      />
                    </Paper>
                  </div>
                </div>
              ) : (
                <p> 0 products found !</p>
              )
            ) : (
              <Loading_Dots />
            )}
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

export default withStyles(styles)(DialogProductInput);
