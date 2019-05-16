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

class NewRequest extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300
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

  render() {
    return (
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-6 text-center">
            <h4> Please insert the organization's details</h4>
          </div>
        </div>

        <div class="row justify-content-center mt-5">
          <div class="form-group col-4">
            <label for="inputName">Organization name</label>
            <input
              type="text"
              class="form-control"
              id="inputName"
              placeholder="Enter organization name"
              required
            />
          </div>
          <div class="form-group col-4">
            <label for="inputDescription">Organization description</label>
            <input
              type="text"
              class="form-control"
              id="inputDescription"
              placeholder="Enter email"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default NewRequest;
