import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { getCostTypes, createCostType } from "../../actions/costTypesActions";
import DataTable from "../DataTable";
import { Button, Link, Tooltip, Fab } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import AddIcon from "@material-ui/icons/Add";
import { getUnits } from "../../actions/productsActions";
import iziToast from "izitoast";
const Loading = React.lazy(() => import("../../views/Loading"));
const DialogCreate = React.lazy(() => import("./DialogCreate"));

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing(1)
  }
});

class CostTypes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectProd: [],
      costs: [],
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

  closeModalCreate = (description, co2eq, unit) => {
    if (description != null) {
      var body = {
        description: description,
        unit: unit,
        co2: co2eq
      };

      this.props.createCostType(body, this.props.account).then(response => {
        if (response.valid) {
          this.showNotification("success", "Cost Type created !");
          this.setState({ openCreateModal: false, loading: true }, () => {
            this.props.getCostTypes().then(response => {
              this.setState({ loading: false });
              if (response) {
                var arr = this.props.cost_types.data.map(cost => ({
                  Description: cost.description,
                  CO2eq: cost.CO2eq,
                  Unit: cost.unit
                }));
                this.setState({ costs: arr, loading: false });
              }
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
    this.props.getCostTypes().then(response => {
      if (response) {
        console.log(this.props.cost_types);
        var arr = this.props.cost_types.data.map(cost => ({
          Description: cost.description,
          CO2eq: cost.CO2eq,
          Unit: cost.unit
        }));
        this.setState({ costs: arr, loading: false });
      }
    });

    this.props.getUnits().then(res => {
      this.setState({ units: this.props.units.data });
    });
  }

  render() {
    const { classes } = this.props;
    return !this.state.loading &&
      this.state.costs &&
      this.state.costs.length > 0 ? (
      <div>
        <DataTable
          data={this.state.costs}
          name={"Cost Types"}
          updateSelectedList={this.updateSelectedList}
          selectionEnable={false}
          multipleSelectionEnable={false}
        />

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
      <p>Sem cost types</p>
    ) : this.state.loading ? (
      <Loading className={"mb-5"} />
    ) : null;
  }
}

const mapStateToProps = state => ({
  cost_types: state.cost_types.costTypes,
  units: state.products.units
});

export default connect(
  mapStateToProps,
  { getCostTypes, getUnits, createCostType }
)(withStyles(styles)(CostTypes));
