import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { getFootPrintsFinal } from "../../actions/productsActions";
import DataTable from "../DataTable";
import { Button, Link } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoOutlined";
const Loading = React.lazy(() => import("../../views/Loading"));

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
      loading: true
    };
  }

  updateSelectedList = selected => {
    console.log(selected[0][0]);
    this.setState({ selectProd: selected[0][0] });
  };

  componentWillMount() {
    this.props.getFootPrintsFinal().then(response => {
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
        <div className="row justify-content-end mt-5">
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
      </div>
    ) : !this.state.loading && this.state.prods.length == 0 ? (
      <p>Sem produtos</p>
    ) : this.state.loading ? (
      <Loading className={"mb-5"} />
    ) : null;
  }
}

const mapStateToProps = state => ({
  foot_prints: state.products.fp_prod
});
export default connect(
  mapStateToProps,
  { getFootPrintsFinal }
)(withStyles(styles)(Products));
