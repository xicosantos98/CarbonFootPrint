import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { getFilterOrganizations } from "../../actions/organizationsActions";
import { getFootPrintsFinal } from "../../actions/productsActions";
import DataTable from "../DataTable";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { Button } from "@material-ui/core";
const Loading = React.lazy(() => import("../../views/Loading"));
const Dialog = React.lazy(() => import("./DialogDetails"));

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
  }
});

const divStyle = {
  alignItems: "center",
  justifyContent: "center"
};

const BootstrapInput = withStyles(theme => ({
  input: {
    border: "0px solid #ced4da"
  }
}))(InputBase);

class Details extends Component {
  state = {
    selectValue: "Products",
    searchText: "",
    selectProd: 0,
    searchClick: false,
    loading: false,
    resultData: [],
    openModal: false
  };

  updateSelectedList = selected => {
    if (selected.length > 0) {
      this.setState({ selectProd: selected[0][0] });
    } else {
      this.setState({ selectProd: 0 });
    }
  };

  openModal = () => {
    this.setState({
      openModal: true
    });
  };

  closeModal = () => {
    this.setState({
      openModal: false
    });
  };

  search = () => {
    this.setState({ loading: true });

    this.setState({ searchClick: true });

    if (this.state.selectValue == "Products") {
      this.props.getFootPrintsFinal(this.state.searchText).then(response => {
        if (response) {
          var prodsArray = [];

          for (var i = 0; i < this.props.filtered_products.data.length; i++) {
            var prod = {
              Ref: this.props.filtered_products.data[i].id,
              Name: this.props.filtered_products.data[i].name,
              Month: this.props.filtered_products.data[i].month,
              Year: this.props.filtered_products.data[i].year,
              Organization: this.props.filtered_products.data[i].organization,
              CO2eq: this.props.filtered_products.data[i].CO2eq
            };
            prodsArray.push(prod);
          }

          this.setState({ loading: false });
          this.setState({ resultData: prodsArray });
        }
      });
    } else {
      this.props
        .getFilterOrganizations(this.state.searchText)
        .then(response => {
          if (response) {
            var orgsArray = [];

            for (
              var i = 0;
              i < this.props.filtered_organizations.data.length;
              i++
            ) {
              var org = {
                Name: this.props.filtered_organizations.data[i].name,
                Description: this.props.filtered_organizations.data[i]
                  .description,
                "Business Area": this.props.filtered_organizations.data[i]
                  .business_area,
                Email: this.props.filtered_organizations.data[i].email,
                CO2eq: this.props.filtered_organizations.data[i].CO2eq
              };
              orgsArray.push(org);
            }

            this.setState({ loading: false });
            this.setState({ resultData: orgsArray });
          }
        });
    }
  };

  enterSearch = event => {
    var code = event.keyCode ? event.keyCode : event.which;
    if (code == 13) {
      this.search();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-md-6 text-right">
            <Paper className={classes.root}>
              <InputBase
                className={classes.input}
                placeholder="Search for organization or product"
                value={this.state.searchText}
                onKeyPress={this.enterSearch}
                onChange={event =>
                  this.setState({ searchText: event.target.value })
                }
              />
              <Select
                className={classes.select}
                value={this.state.selectValue}
                onChange={event =>
                  this.setState({ selectValue: event.target.value })
                }
                input={<BootstrapInput name="selectValue" id="select" />}
              >
                <MenuItem value={"Products"}>Products</MenuItem>
                <MenuItem value={"Organizations"}>Organizations</MenuItem>
              </Select>

              <Divider className={classes.divider} />

              <IconButton
                className={classes.iconButton}
                aria-label="Search"
                onClick={this.search}
              >
                <SearchIcon style={{ color: "#0b5b3b" }} />
              </IconButton>
            </Paper>
            {this.state.openModal ? (
              <Dialog
                open={this.state.openModal}
                onClose={this.closeModal}
                id={this.state.selectProd}
              />
            ) : null}
          </div>
        </div>
        <div className="row justify-content-center mt-5 mb-3">
          <div className="col-12 col-md-8 text-center">
            {this.state.resultData &&
            this.state.resultData.length > 0 &&
            this.state.searchClick &&
            !this.state.loading ? (
              <DataTable
                data={this.state.resultData}
                name={"Results"}
                updateSelectedList={this.updateSelectedList}
                selectionEnable={this.state.selectValue == "Products"}
                multipleSelectionEnable={false}
              />
            ) : this.state.loading ? (
              <Loading className={"mb-5"} />
            ) : null}
            {this.state.resultData &&
            this.state.resultData.length == 0 &&
            this.state.searchClick &&
            !this.state.loading ? (
              <p> Data not found </p>
            ) : null}
          </div>
        </div>
        {this.state.resultData &&
        this.state.resultData.length > 0 &&
        this.state.searchClick &&
        !this.state.loading ? (
          <div className="row justify-content-center mt-2 mb-3">
            <div className="col-6" />
            <div className="col-2 text-right">
              <Button
                variant="contained"
                color="primary"
                style={{ textTransform: "none" }}
                fullWidth
                className={classes.button}
                onClick={this.openModal}
                disabled={this.state.selectProd == 0}
              >
                <InfoIcon className={classes.leftIcon} />
                Details
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  filtered_organizations: state.organizations.filteredOrganizations,
  filtered_products: state.products.fp_prod
});
export default connect(
  mapStateToProps,
  { getFilterOrganizations, getFootPrintsFinal }
)(withStyles(pageStyles)(Details));
