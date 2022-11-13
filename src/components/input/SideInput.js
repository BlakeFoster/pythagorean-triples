import React from 'react';
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InputGroup from "./InputGroup.js";
import NumericTextField from "./NumericTextField.js";
import { STUDS, PLATES } from "../../model/Unit.js";

class SideInput extends React.Component {

  renderUnitsButton(units) {
    return (
      <ToggleButton
        selected={this.props.units === units}
        onClick={() => {this.props.unitsCallback(units)}}
      >{units}</ToggleButton>
    );
  }

  render() {
    return (
      <InputGroup label={"Side " + this.props.sideName}>
        <NumericTextField value={this.props.maxLength} onChange={this.props.maxLengthCallback} label="Max length"/>
        &nbsp;&nbsp;
        <ToggleButtonGroup exlusive color="warning" value={this.props.units}>
          {this.renderUnitsButton(STUDS)}
          {this.renderUnitsButton(PLATES)}
        </ToggleButtonGroup>
      </InputGroup>
    );
  }
}

export default SideInput;