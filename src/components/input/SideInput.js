import React from 'react';
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Switch from "@mui/material/Switch"
import Tooltip from "@mui/material/Tooltip"
import InputGroup from "./InputGroup";
import NumericTextField from "./NumericTextField";
import { STUDS, PLATES } from "../../model/Unit";

const MAX_LENGTH = 100;

class SideInput extends React.Component {
  renderUnitButton(unit) {
    return (
      <ToggleButton
        selected={this.props.config.requestedUnit === unit}
        onClick={() => {this.props.updateConfig(this.props.config.updateRequestedUnit(unit))}}
        value={unit.toString()}
      >{unit.toString()}</ToggleButton>
    );
  }

  clampLength() {
    if (this.props.config.maxLength != null && this.props.config.maxLength > MAX_LENGTH) {
      this.props.updateConfig(this.props.config.updateMaxLength(MAX_LENGTH));
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
            value={this.props.config.maxLength}
            onChange={(l) => {this.props.updateConfig(this.props.config.updateMaxLength(l))}}
            onBlur={this.clampLength.bind(this)}
            label="Max length"
          />
        </div>
        <div className="inputSettings">
          <ToggleButtonGroup exlusive="true" color="warning">
            {this.renderUnitButton(STUDS)}
            {this.renderUnitButton(PLATES)}
          </ToggleButtonGroup>
          <div className="constrainedSwitch">
            Constrain<br/>Unit<br/>
            <Tooltip title="Turn on to only generate triangles which use the unit selected to the left on this side.">
              <Switch
                size="small"
                checked={this.props.config.constrain}
                onChange={() => {this.props.updateConfig(this.props.config.toggleConstrain())}}
              />
            </Tooltip>
          </div>
        </div>
      </InputGroup>
    );
  }
}

export default SideInput;