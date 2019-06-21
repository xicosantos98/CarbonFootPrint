import React, { Component } from "react";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/DeleteForeverOutlined";
import { getOrganizationDetails } from "../../actions/organizationsActions";
import moment from "moment";
import { DatePicker, KeyboardDatePicker } from "@material-ui/pickers";

moment.locale("pt");

const Dialog = React.lazy(() => import("../DynamicDialog"));
const TableInputs = React.lazy(() => import("./TableInputs"));

const styles = theme => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  rootTable: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
    marginBottom: theme.spacing(4)
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

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      productInputSearch: "",
      open: false,
      outputProdSelected: "",
      outputProds: [],
      actDate: moment().format("MMMM YYYY"),
      monthInput: moment().format("MMMM"),
      yearInput: moment().format("YYYY"),
      quantityInput: 0,
      co2eqInput: 0,
      tableRows: []
    };
  }

  openModal = () => {
    if (this.state.searchText !== "" && this.state.outputProds) {
      var filter_array = this.state.outputProds.filter(prod =>
        prod.main.toLowerCase().match(this.state.searchText.toLowerCase())
      );
      this.setState({ outputProds: filter_array });
    }
    this.setState({
      open: true
    });
  };

  closeModal = value => {
    this.setState({ outputProdSelected: value, open: false });
    var new_array = this.props.organization.data.products.map(prod => ({
      main: prod.name,
      secondary: prod.description
    }));
    this.setState({ outputProds: new_array });
  };

  addNewRow = () => {
    if (this.state.productInputSearch != "" && this.state.quantityInput != "") {
      var arr = this.state.tableRows;
      arr.push({
        description: this.state.productInputSearch,
        year: this.state.yearInput,
        month: this.state.monthInput,
        quantity: this.state.quantityInput,
        co2eq: this.state.co2eqInput
      });
      this.setState({ tableRows: arr });
    }
  };

  deletRow = id => {
    var arr = this.state.tableRows.splice(id, 1);
    this.setState({ tableRows: arr });
  };

  componentWillMount() {
    this.props.getOrganizationDetails(this.props.id_org).then(res => {
      var new_array = this.props.organization.data.products.map(prod => ({
        main: prod.name,
        secondary: prod.description
      }));
      this.setState({ outputProds: new_array });
    });
  }

  render() {
    const { classes } = this.props;
    //const { anchorEl } = this.state;
    return (
      <div>
        <div className="row justify-content-start mt-4">
          <div className="col-8 text-center">
            <Paper className={classes.root}>
              <InputBase
                className={classes.input}
                placeholder="Please select an output product"
                value={this.state.searchText}
                //onKeyPress={this.enterSearch}
                onChange={event =>
                  this.setState({ searchText: event.target.value })
                }
              />
              <IconButton
                className={classes.iconButton}
                aria-label="Search"
                onClick={this.openModal}
              >
                <SearchIcon style={{ color: "#0b5b3b" }} />
              </IconButton>
              <Divider className={classes.divider} />
              <IconButton
                aria-label="More"
                aria-controls="long-menu"
                aria-haspopup="true"
                //onClick={this.openMenuOutput}
              >
                <AddIcon style={{ color: "#0b5b3b" }} />
              </IconButton>
            </Paper>
            <Dialog
              open={this.state.open}
              onClose={this.closeModal}
              data={this.state.outputProds}
            />
          </div>
        </div>
        {this.state.outputProdSelected !== "" ? (
          <div className="row justify-content-start ml-1 mt-1">
            <div className="col-4">
              <Typography variant="caption" gutterBottom>
                Selected product: {this.state.outputProdSelected}
              </Typography>
            </div>
          </div>
        ) : null}
        <div className="row justify-content-start mt-4 mb-4">
          <div className="col-4">
            <KeyboardDatePicker
              clearable
              label="Activity Date"
              value={this.state.actDate}
              onChange={(date, x) => {
                this.setState({ actDate: x });
                this.setState({ yearInput: moment(x).format("YYYY") });
                this.setState({ monthInput: moment(x).format("MMMM") });
              }}
              views={["year", "month"]}
            />
          </div>
        </div>
        <div className="col-12">
          <div
            className="row justify-content-start"
            style={{ marginTop: "5em" }}
          >
            <div className="col-4 text-start">
              <Typography color="inherit" variant="h6">
                Input Products
              </Typography>
            </div>
          </div>
          <div className="row col-12 justify-content-start mt-4">
            <div className="col-3">
              <TextField
                label="Search for product"
                value={this.state.productInputSearch}
                onChange={event =>
                  this.setState({ productInputSearch: event.target.value })
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Search"
                        //onClick={handleClickShowPassword}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </div>
            <div className="col-2">
              <TextField
                label="Year"
                value={this.state.yearInput}
                read
                InputProps={{
                  readOnly: true
                }}
              />
            </div>
            <div className="col-2">
              <TextField
                label="Month"
                value={this.state.monthInput}
                InputProps={{
                  readOnly: true
                }}
              />
            </div>
            <div className="col-2">
              <TextField
                label="Quantity"
                value={this.state.quantityInput}
                type="number"
                onChange={event =>
                  this.setState({ quantityInput: event.target.value })
                }
              />
            </div>
            <div className="col-2">
              <TextField
                label="CO2eq"
                type="number"
                value={this.state.co2eqInput}
                InputProps={{
                  readOnly: true
                }}
              />
            </div>
            <div className="col-1">
              <Tooltip title="Add Input">
                <Fab
                  color="primary"
                  aria-label="Add"
                  className={classes.fab}
                  onClick={this.addNewRow}
                >
                  <AddIcon className={classes.extendedIcon} />
                </Fab>
              </Tooltip>
            </div>
          </div>

          <div className="row col-12 justify-content-center text-center">
            <div className="col-10">
              <Paper className={classes.rootTable}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Input Product</StyledTableCell>
                      <StyledTableCell align="right">Year</StyledTableCell>
                      <StyledTableCell> Month </StyledTableCell>
                      <StyledTableCell align="right">Quantity</StyledTableCell>
                      <StyledTableCell align="right">CO2eq</StyledTableCell>
                      <StyledTableCell align="right" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.tableRows.length != 0 ? (
                      this.state.tableRows.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell component="th" scope="row">
                            {row.description}
                          </TableCell>
                          <TableCell align="right">{row.year}</TableCell>
                          <TableCell>{row.month}</TableCell>
                          <TableCell align="right">{row.quantity}</TableCell>
                          <TableCell align="right">{row.co2eq}</TableCell>
                          <TableCell align="right">
                            <Tooltip title="Remove">
                              <IconButton
                                className={classes.iconButton}
                                aria-label="Search"
                                onClick={event => {
                                  var arr = this.state.tableRows;
                                  delete arr[i];
                                  this.setState({ tableRows: arr });
                                }}
                              >
                                <DeleteIcon style={{ color: "#0b5b3b" }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <p> Inser a new input product </p>
                    )}
                  </TableBody>
                </Table>
              </Paper>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  organization: state.organizations.org_details
});
export default connect(
  mapStateToProps,
  { getOrganizationDetails }
)(withStyles(styles)(Create));
