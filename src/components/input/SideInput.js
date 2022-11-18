import React from 'react';
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InputGroup from "./InputGroup";
import NumericTextField from "./NumericTextField";
import { STUDS, PLATES } from "../../model/Unit";

const MAX_LENGTH = 100;

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

  clampLength() {
    if (this.props.maxLength != null && this.props.maxLength > MAX_LENGTH) {
      this.props.maxLengthCallback(MAX_LENGTH);
    }
  }

  render() {
    return (
      <InputGroup
        label={"Side " + this.props.sideName}
        hoverCallback={this.props.hoverCallback}
        className={this.props.className}
      >
        <div className="inputValue">
          <NumericTextField
            value={this.props.maxLength}
            onChange={this.props.maxLengthCallback}
            onBlur={this.clampLength.bind(this)}
            label="Max length"
          />
        </div>
        <div className="inputSettings">
          <ToggleButtonGroup exlusive="true" color="warning">
            {this.renderUnitButton(STUDS)}
            {this.renderUnitButton(PLATES)}
          </ToggleButtonGroup>
        </div>
      </InputGroup>
    );
  }
}

export default SideInput;