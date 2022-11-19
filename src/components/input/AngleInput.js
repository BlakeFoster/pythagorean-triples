import React from "react";
import Switch from "@mui/material/Switch"
import Tooltip from "@mui/material/Tooltip"
import InputGroup from "./InputGroup";
import NumericTextField from "./NumericTextField";
import { DEGREES, THETA } from "../../constants"


function OverUnderSwitch(props) {
  return (
    <>
      <Tooltip title={props.tooltip}>
        <Switch
          size="small"
          checked={props.isAllowed}
          onChange={() => {props.callback(!props.isAllowed)}}
        />
      </Tooltip> {props.label}
    </>
  );
}


class AngleInput extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      angleInputLength: 0,
      angleInputTop: 0
    }
    this.angleInputRef = React.createRef();
    this.angleControlGroupRef = React.createRef();
  }

  clampAngle() {
    if (this.props.desiredAngle != null) {
      const desiredAngle = this.props.desiredAngle % 90;
      this.setDesiredAngle(desiredAngle ? desiredAngle : null);
    }
  }

  setDesiredAngle(desiredAngle) {
    const input = this.angleInputRef.current;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const inputStyle = getComputedStyle(input);
    context.font = inputStyle.font;
    const width = desiredAngle ? context.measureText(desiredAngle.toString()).width : 0;
    const padding = inputStyle.getPropertyValue("padding-top")

    const angleInputRect = input.getBoundingClientRect();
    const angleControlGroupRect = this.angleControlGroupRef.current.getBoundingClientRect();
    this.setState(
      {
        angleInputLength: width,
        angleInputTop: angleInputRect.top - angleControlGroupRect.top,
        angleInputPadding: padding
      }
    );
    this.props.updateConfig(this.props.config.updateDesiredAngle(desiredAngle));
  }

  render() {
    return (
      <InputGroup label="Desired Angle" hoverCallback={this.props.hoverCallback}>
        <div className="inputValue" ref={this.angleControlGroupRef}>
          <div
            className="degreeOverlay"
            style={
              this.state.angleInputLength ? {
                left: this.state.angleInputLength + "px",
                top: this.state.angleInputTop + "px",
                paddingTop: this.state.angleInputPadding
              } : {display: "none"}}
          >{DEGREES}</div>
          <NumericTextField
            label={THETA}
            value={this.props.config.desiredAngle}
            onChange={this.setDesiredAngle.bind(this)}
            onBlur={this.clampAngle.bind(this)}
            inputRef={this.angleInputRef}
          />
        </div>
        <div className="inputSettings">
          <OverUnderSwitch
            isAllowed={this.props.config.allowOver}
            label="Allow Over"
            callback={() => {this.props.updateConfig(this.props.config.toggleAllowOver())}}
            tooltip="Include angles larger than the requested angle."
          />
          <br/>
          <OverUnderSwitch
            isAllowed={this.props.config.allowUnder}
            label="Allow Under"
            callback={() => {this.props.updateConfig(this.props.config.toggleAllowUnder())}}
            tooltip="Include angles smaller than the requested angle."
          />
        </div>
      </InputGroup>
    );
  }
}

export default AngleInput;