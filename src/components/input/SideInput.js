import React from 'react';
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip"
import InputGroup from "./InputGroup";
import NumericTextField from "./NumericTextField";
import { STUDS, PLATES } from "../../model/Unit";
import Switch from "@mui/material/Switch"

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
          <div className="constrainedSwitch">
            Constrain<br/>output<br/>
            <Tooltip title="If checked, all triangles generated will use the selected unit for this side.">
              <Switch
                size="small"
                checked={this.props.constrainOutput}
                onChange={this.props.constrainCallback.bind(this, !this.props.constrainOutput)}
              />
            </Tooltip>
          </div>
        </div>
      </InputGroup>
    );
  }
}

export default SideInput;