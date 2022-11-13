import React from 'react';
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InputGroup from "./InputGroup";
import NumericTextField from "./NumericTextField";
import { STUDS, PLATES } from "../../model/Unit";

class SideInput extends React.Component {

  renderUnitButton(unit) {
    return (
      <ToggleButton
        selected={this.props.unit === unit}
        onClick={() => {this.props.unitCallback(unit)}}
        value={unit.toString()}
      >{unit.toString()}</ToggleButton>
    );
  }

  render() {
    return (
      <InputGroup label={"Side " + this.props.sideName}>
        <NumericTextField value={this.props.maxLength} onChange={this.props.maxLengthCallback} label="Max length"/>
        &nbsp;&nbsp;
        <ToggleButtonGroup exlusive="true" color="warning">
          {this.renderUnitButton(STUDS)}
          {this.renderUnitButton(PLATES)}
        </ToggleButtonGroup>
      </InputGroup>
    );
  }
}

export default SideInput;