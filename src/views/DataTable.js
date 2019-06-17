import React, { Component } from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import BlockIcon from "@material-ui/icons/EventBusy";
import AcceptIcon from "@material-ui/icons/EventAvailable";
import { dark } from "@material-ui/core/styles/createPalette";
import { IncomingMessage } from "http";
import { isNull } from "util";

class EnhancedTableHead extends React.Component {
  renderHeadingRow = (_cell, cellIndex) => {
    let header = Object.keys(this.props.data[0]);

    if (this.props.hideColumns) {
      for (var i = 0; i < this.props.hideColumns.length; i++) {
        if (cellIndex == this.props.hideColumns[i]) {
          return null;
        }
      }
    }
    return <TableCell key={cellIndex}>{header[cellIndex]}</TableCell>;
  };

  render() {
    const { onSelectAllClick, numSelected, rowCount } = this.props;

    const theadMarkup = (
      <TableRow key="heading">
        {this.props.selectionEnable ? (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
              disabled={!this.props.multipleSelectionEnable}
              color="primary"
            />
          </TableCell>
        ) : null}

        {Object.keys(this.props.data[0]).map(this.renderHeadingRow)}
      </TableRow>
    );

    return <TableHead>{theadMarkup}</TableHead>;
  }
}

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: "#ffffff",
          backgroundColor: "#4caf50"
        }
      : {
          color: "#ffffff",
          backgroundColor: "#4caf50"
        },
  spacer: {
    flex: "1 1 100%"
  },
  primary: {
    light: "#ffff00",
    main: "#0b5b3b",
    dark: "#0b5b3b",
    contrastText: "#fff"
  },
  colorIcons: {
    color: "#fff"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes, onDeleselectAllClick, tName } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle" style={{ color: "#0b5b3b" }}>
            {tName}
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
    </Toolbar>
  );
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    maxHeight: 100
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

class DataTable extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    selected: [],
    selectedName: [],
    data: [],
    page: 0,
    rowsPerPage: 5
  };
  isNull;

  componentWillMount() {
    var rows = [];
    var data = this.props.data;
    for (var i = 0; i < data.length; i++) {
      var tmp_array = [];
      Object.keys(data[i]).forEach(function(key) {
        tmp_array.push(data[i][key]);
      });
      rows.push(tmp_array);
    }
    this.setState({ data: rows });
  }

  componentWillReceiveProps(props) {
    var rows = [];
    var data = props.data;
    for (var i = 0; i < data.length; i++) {
      var tmp_array = [];
      Object.keys(data[i]).forEach(function(key) {
        tmp_array.push(data[i][key]);
      });
      rows.push(tmp_array);
    }
    this.setState({ data: rows });
    if (this.props.data.length != props.data.length) {
      this.setState({ selectedName: [] });
    }
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({
        selectedName: state.data.map((n, i) => n[0])
      }));
      this.props.updateSelectedList(this.state.data.map((n, i) => n));
      return;
    }
    this.setState({ selectedName: [] });
    this.props.updateSelectedList([]);
  };

  handleDeselectAll = () => {
    this.setState({ selected: [] });
  };

  handleClick = (event, name) => {
    if (this.props.selectionEnable) {
      const { selectedName } = this.state;
      const selectedIndex = selectedName.indexOf(name);
      var newSelected = [];

      if (!this.props.multipleSelectionEnable) {
        this.state.selectedName.length = 0;
      }

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedName, name);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedName.slice(1));
      } else if (selectedIndex === selectedName.length - 1) {
        newSelected = newSelected.concat(selectedName.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selectedName.slice(0, selectedIndex),
          selectedName.slice(selectedIndex + 1)
        );
      }

      this.setState({ selectedName: newSelected }, () => {
        console.log(this.state.selectedName);
      });

      var dataSelected = [];

      newSelected.map((n, i) => {
        for (var x = 0; x < this.state.data.length; x++) {
          if (this.state.data[x][0] == n) {
            dataSelected.push(this.state.data[x]);
          }
        }
      });
      this.props.updateSelectedList(dataSelected);
    }
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = name => this.state.selectedName.indexOf(name) !== -1;

  renderRow = (_row, rowIndex) => {
    const isSelected = this.isSelected(_row[0]);
    return (
      <TableRow
        key={rowIndex}
        hover
        onClick={event => this.handleClick(event, _row[0])}
        role="checkbox"
        aria-checked={isSelected}
        tabIndex={-1}
        selected={isSelected}
      >
        {this.props.selectionEnable ? (
          <TableCell padding="checkbox">
            <Checkbox checked={isSelected} color="primary" />
          </TableCell>
        ) : null}

        {this.state.data
          .slice(
            this.state.page * this.state.rowsPerPage,
            this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
          )
          [rowIndex].map((_cell, cellIndex) => {
            if (this.props.hideColumns) {
              for (var i = 0; i < this.props.hideColumns.length; i++) {
                if (cellIndex == this.props.hideColumns[i]) {
                  return null;
                }
              }
            }

            return (
              <TableCell key={`${rowIndex}-${cellIndex}`}>
                {
                  this.state.data.slice(
                    this.state.page * this.state.rowsPerPage,
                    this.state.page * this.state.rowsPerPage +
                      this.state.rowsPerPage
                  )[rowIndex][cellIndex]
                }
              </TableCell>
            );
          })}
      </TableRow>
    );
  };

  render() {
    const { classes } = this.props;
    const {
      data,
      order,
      orderBy,
      selectedName,
      rowsPerPage,
      page
    } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar
          numSelected={selectedName.length}
          onDeleselectAllClick={this.handleDeselectAll}
          tName={this.props.name}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selectedName.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              data={this.props.data}
              selectionEnable={this.props.selectionEnable}
              multipleSelectionEnable={this.props.multipleSelectionEnable}
              hideColumns={this.props.hideColumns}
            />
            <TableBody>
              {this.state.data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(this.renderRow)}
              {emptyRows > 0 && (
                <TableRow style={{ height: 20 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
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
    );
  }
}

export default withStyles(styles)(DataTable);
