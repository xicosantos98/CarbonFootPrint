import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import green from "@material-ui/core/colors/green";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";

import axios from "axios";
import iziToast from "izitoast";

import { connect } from "react-redux";
import { getBAreas, createRequest } from "../../actions/requestsActions";
import PropTypes from "prop-types";

import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#0b5b3b",
      dark: "#0b5b3b",
      contrastText: "#fff"
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000"
    },
    typography: {
      useNextVariants: true
    }
  }
});

function findBArea(barea) {
  if (barea.Descricao === this[0]) {
    return barea;
  }
}

class NewRequest extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      b_areaSelected: "",
      subAreaSelected: "",
      b_areas: [],
      subAreas: [],
      textName: "",
      textDescription: "",
      email: ""
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState(prevState => {
      return { fadeIn: !prevState };
    });
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

  handleChangeBarea = event => {
    this.setState({ b_areaSelected: event.target.value });
    var area = this.props.bareas.find(findBArea, [event.target.value]);
    this.setState({ subAreas: area.sub_cat });
    this.setState({ subAreaSelected: area.sub_cat[0].Descricao });
  };

  handleChangeSubAreas = event => {
    this.setState({ subAreaSelected: event.target.value });
  };

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  componentWillMount() {
    this.props.getBAreas().then(response => {
      if (this.props.bareas && response) {
        this.setState({ b_areaSelected: this.props.bareas[0].Descricao });
        var area = this.props.bareas.find(findBArea, [
          this.props.bareas[0].Descricao
        ]);
        this.setState({ subAreas: area.sub_cat });
        this.setState({ subAreaSelected: area.sub_cat[0].Descricao });
      }
    });
  }

  submitFormHandler = event => {
    event.preventDefault();

    if (this.state.textName == "" || this.state.textDescription == "") {
      this.showNotification("error", "Please fill all required fields");
    } else if (!this.validateEmail(this.state.email)) {
      this.showNotification("error", "Please enter valid email address");
    } else {
      var body = {
        org_name: this.state.textName,
        org_desc: this.state.textDescription,
        org_barea: this.state.subAreaSelected,
        org_email: this.state.email
      };
      this.props.createRequest(body, this.props.account).then(response => {
        this.setState({ textName: "", textDescription: "", email: "" });

        if (response.valid) {
          this.showNotification("success", response.msg);
        } else {
          this.showNotification("error", response.msg);
        }
      });
    }
  };

  render() {
    return (
      <form onSubmit={this.submitFormHandler}>
        <MuiThemeProvider theme={theme}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-6 text-center">
                <Typography
                  variant="h5"
                  gutterBottom
                  style={{ color: "#0b5b3b" }}
                >
                  Please insert the organization's details
                </Typography>
              </div>
            </div>

            <div className="row justify-content-center mt-5">
              <div className="form-group col-4">
                <TextField
                  label="Organization name"
                  inputProps={{
                    name: "textName",
                    id: "inputName"
                  }}
                  margin="normal"
                  fullWidth
                  autoComplete="off"
                  value={this.state.textName}
                  onChange={event =>
                    this.setState({ textName: event.target.value })
                  }
                  error={this.state.textName === ""}
                  helperText={this.state.textName === "" ? "Required !!" : " "}
                />
              </div>
              <div className="form-group col-4">
                <TextField
                  id="inputDesc"
                  name="inputDesc"
                  label="Organization description"
                  margin="normal"
                  fullWidth
                  autoComplete="off"
                  inputProps={{
                    name: "textDescription",
                    id: "inputDescription"
                  }}
                  value={this.state.textDescription}
                  onChange={event =>
                    this.setState({ textDescription: event.target.value })
                  }
                  error={this.state.textDescription === ""}
                  helperText={
                    this.state.textDescription === "" ? "Required !!" : " "
                  }
                />
              </div>
              <div className="form-group col-4">
                <TextField
                  id="inputEmail"
                  name="inputEmail"
                  label="Organization email"
                  type={"email"}
                  margin="normal"
                  fullWidth
                  autoComplete="off"
                  inputProps={{
                    name: "textEmail",
                    id: "inputEmail"
                  }}
                  onChange={event =>
                    this.setState({ email: event.target.value })
                  }
                  value={this.state.email}
                  error={!this.validateEmail(this.state.email)}
                  helperText={
                    this.state.email === ""
                      ? "Required !!"
                      : !this.validateEmail(this.state.email)
                      ? "Invalid e-mail"
                      : ""
                  }
                />
              </div>
            </div>
            <div className="row justify-content-start mt-4">
              <div className="form-group col-4">
                <InputLabel htmlFor="business_area">
                  Organization business area
                </InputLabel>
                <Select
                  style={{ width: "100%" }}
                  value={this.state.b_areaSelected}
                  onChange={this.handleChangeBarea}
                  inputProps={{
                    name: "business_area",
                    id: "barea"
                  }}
                >
                  {this.props.bareas
                    ? this.props.bareas.map((area, i) => (
                        <MenuItem key={i} value={area.Descricao}>
                          {area.Descricao}
                        </MenuItem>
                      ))
                    : null}
                </Select>
              </div>
              <div className="form-group col-4">
                <InputLabel htmlFor="sub_area">Sub-area</InputLabel>
                <Select
                  style={{ width: "100%" }}
                  value={this.state.subAreaSelected}
                  onChange={this.handleChangeSubAreas}
                  inputProps={{
                    name: "sub_area",
                    id: "subArea"
                  }}
                >
                  {this.state.subAreas.map((area, i) => (
                    <MenuItem key={i} value={area.Descricao}>
                      {area.Descricao}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
            <div className="row justify-content-center mt-4">
              <div className="form-group col-3">
                <Button
                  variant="contained"
                  color="primary"
                  style={{ textTransform: "none" }}
                  fullWidth
                  size="large"
                  type="submit"
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  bareas: state.requests.b_areas
});

export default connect(
  mapStateToProps,
  { getBAreas, createRequest }
)(NewRequest);
