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
import SaveIcon from "@material-ui/icons/Save";
import DeleteIcon from "@material-ui/icons/DeleteForeverOutlined";

import {
  getExternalProducts,
  getOrganizationDetails,
  getProductsOrganization
} from "../../actions/organizationsActions";

import { getUnits } from "../../actions/productsActions";
import { getCostTypes } from "../../actions/costTypesActions";
import moment from "moment";
import { DatePicker, KeyboardDatePicker } from "@material-ui/pickers";
import Loading_Dots from "../Loading_Dots";
import { stat } from "fs";
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem
} from "@material-ui/core";

moment.locale("pt");

const DialogOutput = React.lazy(() => import("./DialogProductOut"));
const DialogInput = React.lazy(() => import("./DialogProductInput"));

/* #region  Styles */
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
    marginLeft: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  margin: {
    margin: theme.spacing(1)
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

/* #endregion */

class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      description: "",
      searchText: "",
      productInputSearch: "",
      openOutputModal: false,
      openInputModal: false,
      outputProdSelected: {},
      inputProdSelected: {},
      outputProds: [],
      inputProds: [],
      units: [],
      filteredInputProds: [],
      actDate: moment().format("MMMM YYYY"),
      monthInput: moment().format("MMMM"),
      yearInput: moment().format("YYYY"),
      quantityInput: 0,
      quantityInputCost: 0,
      co2eqInput: 0,
      tableRows: [],
      loadingOutput: true,
      loadingInput: true,
      totalCO2eq: 0,
      totalCO2eqProduct: 0,
      selectedInputOption: "products",
      costTypeSelected: {}
    };
  }

  // Ctrl + M - Ctrl + R

  /* #region  Modal Output Products */
  openModalOutput = () => {
    this.props
      .getOrganizationDetails(this.props.id_org, this.state.searchText)
      .then(res => {
        var new_array = this.props.organization.data.products.map(prod => ({
          id: prod.id,
          main: prod.name,
          secondary: prod.description
        }));
        this.setState({ outputProds: new_array }, () => {
          this.setState({ loadingOutput: false });
        });
      });
    this.setState({
      openOutputModal: true
    });
  };

  closeModalOutput = value => {
    this.setState({ outputProdSelected: value, openOutputModal: false });
    this.setState({ loadingOutput: true });
  };

  /* #endregion */

  /* #region  Modal Input Products */
  openModalInput = () => {
    this.props
      .getProductsOrganization(this.props.id_org, this.state.productInputSearch)
      .then(res => {
        this.setState({ inputProds: this.props.p_footprints.data }, () => {
          this.setState({ loadingInput: false });
        });
      });

    this.setState({
      openInputModal: true
    });
  };

  closeModalInput = value => {
    this.setState({
      openInputModal: false,
      inputProdSelected: value,
      loadingInput: true,
      co2eqInput: value.CO2eq,
      monthInput: value.month,
      yearInput: value.year
    });
  };

  onFilterChange = filter => {
    if (filter == "own_org") {
      this.setState({ loadingInput: true }, () => {
        this.props
          .getProductsOrganization(
            this.props.id_org,
            this.state.productInputSearch
          )
          .then(res => {
            this.setState({ inputProds: this.props.p_footprints.data }, () => {
              this.setState({ loadingInput: false });
            });
          });
      });
    } else {
      this.setState({ loadingInput: true }, () => {
        this.props
          .getExternalProducts(this.props.id_org, this.state.productInputSearch)
          .then(res => {
            this.setState(
              { inputProds: this.props.external_footprints.data },
              () => {
                this.setState({ loadingInput: false });
              }
            );
          });
      });
    }
  };
  /* #endregion */

  addNewRow = () => {
    if (
      this.state.selectedInputOption == "products" &&
      this.state.inputProdSelected.product != "" &&
      this.state.quantityInput != ""
    ) {
      var arr = this.state.tableRows;
      arr.push({
        type: "product",
        description: this.state.inputProdSelected.product,
        year: this.state.inputProdSelected.year,
        month: this.state.inputProdSelected.month,
        quantity: this.state.quantityInput,
        co2eq: this.state.co2eqInput
      });
      this.setState({ tableRows: arr }, () => {
        var new_row =
          Number(this.state.quantityInput) * Number(this.state.co2eqInput);

        var totalProduct = Number(this.state.totalCO2eqProduct) + new_row;
        var totalActivity = Number(this.state.totalCO2eq) + new_row;

        this.setState({
          inputProdSelected: {},
          quantityInput: 0,
          co2eqInput: 0,
          totalCO2eqProduct: totalProduct.toFixed(3),
          totalCO2eq: totalActivity.toFixed(3)
        });
      });
    } else if (
      this.state.selectedInputOption == "costs" &&
      this.state.quantityInputCost != ""
    ) {
      var arr = this.state.tableRows;
      arr.push({
        type: "cost",
        description: this.state.costTypeSelected.description,
        year: moment().format("YYYY"),
        month: moment().format("MMMM"),
        quantity: this.state.quantityInputCost,
        co2eq: this.state.costTypeSelected.CO2eq
      });
      this.setState({ tableRows: arr }, () => {
        var new_row =
          Number(this.state.quantityInputCost) *
          Number(this.state.costTypeSelected.CO2eq);
        var totalProduct = Number(this.state.totalCO2eqProduct) + new_row;

        this.setState({
          costTypeSelected: {},
          quantityInputCost: "",
          totalCO2eqProduct: totalProduct.toFixed(3)
        });
      });
    }
  };

  handleInputOptChange = event => {
    this.setState({ selectedInputOption: event.target.value });
  };

  handleChangeCostType = event => {
    this.setState({ costTypeSelected: event.target.value });
  };

  componentWillMount = () => {
    this.props.getUnits().then(res => {
      this.setState({ units: this.props.units.data });
    });

    this.props.getCostTypes();
  };

  render() {
    const { classes } = this.props;
    //const { anchorEl } = this.state;
    console.log(this.state.costTypeSelected);
    return (
      <div className="col-12">
        <div>
          <div className="row col-12 justify-content-start mt-4">
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
                  onClick={this.openModalOutput}
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
              <DialogOutput
                open={this.state.openOutputModal}
                onClose={this.closeModalOutput}
                data={this.state.outputProds}
                unitTypes={this.state.units}
                isloading={this.state.loadingOutput}
              />
              <DialogInput
                open={this.state.openInputModal}
                onClose={this.closeModalInput}
                data={this.state.inputProds}
                isloading={this.state.loadingInput}
                onFilterChange={this.onFilterChange}
              />
            </div>
            <div className="col-4 text-end">
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Save
                <SaveIcon className={classes.leftIcon} />
              </Button>
            </div>
          </div>
          {this.state.outputProdSelected.main ? (
            <div className="row justify-content-start ml-1 mt-1">
              <div className="col-4">
                <Typography variant="caption" gutterBottom>
                  Selected product: {this.state.outputProdSelected.main}
                </Typography>
              </div>
            </div>
          ) : null}
          <div className="row col-12 justify-content-start mt-4 mb-4">
            <div className="col-4">
              <TextField
                label="Activity description"
                value={this.state.description}
                fullWidth
                onChange={event =>
                  this.setState({ description: event.target.value })
                }
              />
            </div>
            <div className="col-4">
              <KeyboardDatePicker
                clearable
                label="Activity Date"
                value={this.state.actDate}
                onChange={(date, x) => {
                  this.setState({ actDate: x });
                  //this.setState({ yearInput: moment(x).format("YYYY") });
                  //this.setState({ monthInput: moment(x).format("MMMM") });
                }}
                views={["year", "month"]}
              />
            </div>
          </div>
        </div>

        <div>
          <div
            className="row col-12 justify-content-start"
            style={{ marginTop: "5em" }}
          >
            <div className="col-4 text-start">
              <Typography color="inherit" variant="subtitle1">
                Inputs
              </Typography>
            </div>
          </div>
          <div className="row col-12 justify-content-start">
            <div className="col-4 text-start">
              <RadioGroup
                aria-label="Filter Options"
                name="filter"
                value={this.state.selectedInputOption}
                onChange={this.handleInputOptChange}
                style={{ flexDirection: "row" }}
              >
                <FormControlLabel
                  value="products"
                  control={<Radio color="primary" />}
                  label="Products"
                />
                <FormControlLabel
                  value="costs"
                  control={<Radio color="primary" />}
                  label="Costs"
                />
              </RadioGroup>
            </div>
          </div>
          {this.state.selectedInputOption == "products" ? (
            <div className="row col-12 justify-content-start mt-2">
              <div className="col-5">
                <TextField
                  label="Search for product"
                  value={this.state.productInputSearch}
                  onChange={event =>
                    this.setState({ productInputSearch: event.target.value })
                  }
                  fullWidth
                  helperText={
                    this.state.inputProdSelected.product
                      ? "Product Selected: " +
                        this.state.inputProdSelected.product
                      : null
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Search"
                          onClick={this.openModalInput}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </div>
              <div className="col-1">
                <TextField
                  label="Year"
                  value={this.state.yearInput}
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
              <div className="col-1">
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
                    size="small"
                    aria-label="Add"
                    className={classes.fab}
                    style={{ top: "20%" }}
                    onClick={this.addNewRow}
                  >
                    <AddIcon
                      fontSize="small"
                      className={classes.extendedIcon}
                    />
                  </Fab>
                </Tooltip>
              </div>
            </div>
          ) : this.props.cost_types.data &&
            this.props.cost_types.data.length > 0 ? (
            <div className="row col-12 justify-content-start mt-2">
              <div className="col-5">
                <TextField
                  id="outlined-select-currency"
                  select
                  label="Cost type"
                  fullWidth
                  className={classes.textField}
                  value={this.state.costTypeSelected}
                  onChange={this.handleChangeCostType}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  helperText={
                    this.state.costTypeSelected.CO2eq
                      ? "CO2eq: " +
                        this.state.costTypeSelected.CO2eq +
                        " " +
                        this.state.costTypeSelected.unit
                      : null
                  }
                  margin="normal"
                  variant="outlined"
                >
                  {this.props.cost_types.data
                    ? this.props.cost_types.data.map((type, i) => (
                        <MenuItem key={type.id} value={type}>
                          {type.description}
                        </MenuItem>
                      ))
                    : null}
                </TextField>
              </div>
              <div className="col-3">
                <TextField
                  label="Quantity"
                  type="number"
                  style={{ top: "20%" }}
                  value={this.state.quantityInputCost}
                  onChange={event =>
                    this.setState({ quantityInputCost: event.target.value })
                  }
                />
              </div>
              <div className="col-1">
                <Tooltip title="Add Input">
                  <Fab
                    color="primary"
                    size="small"
                    aria-label="Add"
                    className={classes.fab}
                    onClick={this.addNewRow}
                    style={{ top: "20%" }}
                  >
                    <AddIcon
                      fontSize="small"
                      className={classes.extendedIcon}
                    />
                  </Fab>
                </Tooltip>
              </div>
            </div>
          ) : null}

          {this.state.tableRows.length > 0 ? (
            <div className="row col-12 justify-content-start text-center">
              <div className="col-10">
                <Paper className={classes.rootTable}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Input Product</StyledTableCell>
                        <StyledTableCell align="right">Year</StyledTableCell>
                        <StyledTableCell> Month </StyledTableCell>
                        <StyledTableCell align="right">
                          Quantity
                        </StyledTableCell>
                        <StyledTableCell align="right">CO2eq</StyledTableCell>
                        <StyledTableCell align="right" />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.tableRows.map((row, i) => (
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
                                  var co2eq_del =
                                    Number(arr[i].co2eq) *
                                    Number(arr[i].quantity);
                                  var new_co2eq =
                                    Number(this.state.totalCO2eq) - co2eq_del;
                                  this.setState({
                                    totalCO2eq: new_co2eq.toFixed(3)
                                  });
                                  arr.splice(i, 1);
                                  this.setState({ tableRows: arr });
                                }}
                              >
                                <DeleteIcon style={{ color: "#0b5b3b" }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} />
                        <TableCell colSpan={2}>Total (Activity)</TableCell>
                        <TableCell align="right">
                          {this.state.totalCO2eq}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} />
                        <TableCell colSpan={2}>Total (Product)</TableCell>
                        <TableCell align="right">
                          {this.state.totalCO2eqProduct}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  organization: state.organizations.org_details,
  p_footprints: state.organizations.products_org,
  external_footprints: state.organizations.external_products,
  units: state.products.units,
  cost_types: state.cost_types.costTypes
});
export default connect(
  mapStateToProps,
  {
    getOrganizationDetails,
    getProductsOrganization,
    getExternalProducts,
    getUnits,
    getCostTypes
  }
)(withStyles(styles)(Create));
