import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import {
  getFootPrintsFinal,
  createProduct
} from "../../actions/productsActions";
import DataTable from "../DataTable";
import { Button, Link, Tooltip, Fab } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import AddIcon from "@material-ui/icons/Add";
import { getUnits } from "../../actions/productsActions";
import iziToast from "izitoast";
const Loading = React.lazy(() => import("../../views/Loading"));
const DialogCreate = React.lazy(() => import("./ModalCreate"));

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing(1)
  }
});

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectProd: [],
      prods: [],
      loading: true,
      loadingModal: true,
      openCreateModal: false,
      units: []
    };
  }

  showNotification(type, msg) {
    var color;

    if (type == "error") {
      color = "#ec644b";
    } else {
      color = "#4dbd74";
    }

    iziToast.show({
      title: "",
      position: "topRight",
      messageSize: 15,
      messageColor: "#fff",
      iconColor: "#fff",
      icon: "fa fa-exclamation-triangle",
      message: msg,
      color: color,
      maxWidth: 800,
      progressBarColor: "#fff"
    });
  }

  updateSelectedList = selected => {
    console.log(selected[0][0]);
    this.setState({ selectProd: selected[0][0] });
  };

  openModalCreate = () => {
    this.setState({
      openCreateModal: true
    });
  };

  closeModalCreate = (
    description,
    name,
    month,
    year,
    intermediate,
    co2eq,
    unit
  ) => {
    if (description != null) {
      var body = {
        description: description,
        name: name,
        month: month,
        year: year,
        intermediate: intermediate,
        unit: unit,
        organization: this.props.id_org,
        co2eqProd: co2eq
      };

      this.props.createProduct(body, this.props.account).then(response => {
        if (response.valid) {
          this.showNotification("success", "Product created !");
          this.setState({ openCreateModal: false, loading: true }, () => {
            this.props.getFootPrintsFinal("").then(res => {
              this.setState({ loading: false });
            });
          });
        } else {
          this.showNotification("error", response.msg);
        }
      });
    } else {
      this.setState({ openCreateModal: false });
    }
  };

  componentWillMount() {
    this.props.getFootPrintsFinal("").then(response => {
      if (response) {
        var arr = this.props.foot_prints.data.map(prod => ({
          Ref: prod.id,
          Name: prod.name,
          Organization: prod.organization,
          Month: prod.month,
          Year: prod.year,
          CO2eq: prod.CO2eq
        }));
        this.setState({ prods: arr, loading: false });
      }
    });

    this.props.getUnits().then(res => {
      this.setState({ units: this.props.units.data });
    });
  }

  render() {
    const { classes } = this.props;
    return !this.state.loading &&
      this.state.prods &&
      this.state.prods.length > 0 ? (
      <div>
        <DataTable
          data={this.state.prods}
          name={"Products"}
          updateSelectedList={this.updateSelectedList}
          selectionEnable={true}
          multipleSelectionEnable={false}
        />
        <div className="row justify-content-end mt-2">
          <div className="col-12 col-md-2 text-right">
            <Button
              variant="contained"
              color="primary"
              style={{ textTransform: "none" }}
              fullWidth
              className={classes.button}
              //onClick={this.acceptRequests}
              disabled={this.state.selectProd.length == 0}
              href={"#/company/products/details/" + this.state.selectProd}
            >
              <InfoIcon className={classes.leftIcon} />
              Details
            </Button>
          </div>
        </div>
        <DialogCreate
          open={this.state.openCreateModal}
          onClose={this.closeModalCreate}
          unit_types={this.state.units}
          //data={this.state.costArray}
        />
        <Tooltip title="Create product">
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
            onClick={this.openModalCreate}
          >
            <AddIcon
              style={{ textTransform: "none" }}
              className={classes.extendedIcon}
            />
          </Fab>
        </Tooltip>
      </div>
    ) : !this.state.loading && this.state.prods.length == 0 ? (
      <p>Sem produtos</p>
    ) : this.state.loading ? (
      <Loading className={"mb-5"} />
    ) : null;
  }
}

const mapStateToProps = state => ({
  foot_prints: state.products.fp_prod,
  units: state.products.units
});

export default connect(
  mapStateToProps,
  { getFootPrintsFinal, getUnits, createProduct }
)(withStyles(styles)(Products));
