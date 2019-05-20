import React, { Component } from "react";
import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  InputGroupText,
  Label,
  Row
} from "reactstrap";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import green from "@material-ui/core/colors/green";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";

import axios from "axios";

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
      text: ""
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

  handleChangeBarea = event => {
    this.setState({ b_areaSelected: event.target.value });
    var area = this.state.b_areas.find(findBArea, [event.target.value]);
    this.setState({ subAreas: area.sub_cat });
    this.setState({ subAreaSelected: area.sub_cat[0].Descricao });
  };

  handleChangeSubAreas = event => {
    this.setState({ subAreaSelected: event.target.value });
  };

  loadBAreas = () => {
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:3000/api/v1/requests/b_areas")
        .then(function(response) {
          resolve(response.data);
        })
        .catch(function(error) {
          reject(error);
          return;
        });
    });
  };

  async componentWillMount() {
    let bareas = await this.loadBAreas(this.state.account);
    this.setState({ b_areas: bareas });
    this.setState({ b_areaSelected: bareas[0].Descricao });
    var area = this.state.b_areas.find(findBArea, [bareas[0].Descricao]);
    this.setState({ subAreas: area.sub_cat });
    this.setState({ subAreaSelected: area.sub_cat[0].Descricao });
  }

  render() {
    return (
      <form>
        <MuiThemeProvider theme={theme}>
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-6 text-center">
                <Typography
                  variant="h5"
                  gutterBottom
                  style={{ color: "#0b5b3b" }}
                >
                  Please insert the organization's details
                </Typography>
              </div>
            </div>

            <div class="row justify-content-center mt-5">
              <div class="form-group col-4">
                <TextField
                  id="inputName"
                  label="Organization name"
                  margin="normal"
                  fullWidth
                  autoComplete="off"
                  onChange={event =>
                    this.setState({ text: event.target.value })
                  }
                  error={this.state.text === ""}
                  helperText={this.state.text === "" ? "Empty field!" : " "}
                />
              </div>
              <div class="form-group col-4">
                <TextField
                  id="inputDesc"
                  label="Organization description"
                  margin="normal"
                  fullWidth
                  autoComplete="off"
                />
              </div>
            </div>
            <div class="row justify-content-center mt-4">
              <div class="form-group col-4">
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
                  {this.state.b_areas.map(area => (
                    <MenuItem key={area.cod} value={area.Descricao}>
                      {area.Descricao}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <div class="form-group col-4">
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
            <div class="row justify-content-center mt-4">
              <div class="form-group col-3">
                <Button
                  variant="contained"
                  color="primary"
                  style={{ textTransform: "none" }}
                  fullWidth
                  size="large"
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

export default NewRequest;
