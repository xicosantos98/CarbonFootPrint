import React from "react";
import { forwardRef } from "react";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";

import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import MoreVert from "@material-ui/icons/MoreVert";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

export default function MaterialTableDemo(props) {
  var tableRef = React.createRef();
  var co2eq = 0;
  const [state, setState] = React.useState({
    co2eq: 0,
    columns: [
      {
        title: "Product Input",
        field: "prod_input",
        editComponent: props => (
          <Input
            placeholder="Search for product"
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
            inputProps={{
              "aria-label": "Description"
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Search"
                  onClick={handleClickShowPassword}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            }
          />
        )
      },

      {
        title: "Year",
        field: "year",
        editable: "never",
        emptyValue: <a>{props.year}</a>
      },
      {
        title: "Month",
        field: "month",
        editable: "never",
        emptyValue: <a>{props.month}</a>
      },
      { title: "Quantity", field: "quantity", type: "numeric" },
      {
        title: "CO2eq",
        field: "co2eq",
        type: "numeric",
        editable: "never",
        emptyValue: <a>{co2eq}</a>
      }
    ],
    data: [],
    rowClicked: 0
  });

  const handleClickShowPassword = () => {};

  return (
    <MaterialTable
      title="Input products"
      columns={state.columns}
      icons={tableIcons}
      tableRef={tableRef}
      data={state.data}
      onRowClick={(event, rowData) => {
        var rowClicked = rowData.tableData.id;
        setState({ ...state, rowClicked });
      }}
      options={{
        search: false,
        actionsColumnIndex: -1
      }}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              if (newData.co2eq && newData.prod_input && newData.quantity) {
                resolve();
                console.log(tableRef);
                const data = [...state.data];
                data.push(newData);
                setState({ ...state, data });
              } else {
                resolve();
                alert("Faltam dados");
              }
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const data = [...state.data];
              data[data.indexOf(oldData)] = newData;
              setState({ ...state, data });
            }, 600);
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const data = [...state.data];
              data.splice(data.indexOf(oldData), 1);
              setState({ ...state, data });
            }, 600);
          })
      }}
    />
  );
}
