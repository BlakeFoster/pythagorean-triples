import React from "react";
import SideInput from "./SideInput";
import AngleInput from "./AngleInput";
import CalculateButton from "./CalculateButton";

import { STUDS, Unit } from "../../model/Unit";
import TriangleGraphic from "../graphics/TriangleGraphic";
import { THETA, A, B, C, SIDES } from "../../constants";
import { plain } from "../graphics/SideElement";
import calculateTriples from "../../lib/algorithm";
import SideConfig from "../../model/SideConfig";


const DIAGRAM_WIDTH = 490;
const DIAGRAM_HEIGHT = 300;
const DIAGRAM_MARGIN = 50;

const DIAGRAM_A_UNIT = new Unit("A", 4)
const DIAGRAM_B_UNIT = new Unit("B", 3)
const DIAGRAM_C_UNIT = new Unit("C", 5)
const DIAGRAM_SIDE_LENGTH = 1

const DIAGRAM_HOVER_COLOR = "rgb(255, 190, 70)"
const DIAGRAM_NORMAL_COLOR = "lightgrey"

const ANGLE_FONT_SIZE = 30;


class Diagram extends React.Component {

  sideElement(unit, highlight = false) {
    return plain(unit, this.getDiagramColor(highlight));
  }

  getDiagramColor(highlight) {
    return highlight ? DIAGRAM_HOVER_COLOR : DIAGRAM_NORMAL_COLOR;
  }

  shouldComponentUpdate(nextProps, nextState){
    return (
      nextProps.aHighlight !== this.props.aHighlight ||
      nextProps.bHighlight !== this.props.bHighlight ||
      nextProps.cHighlight !== this.props.cHighlight ||
      nextProps.angleHighlight !== this.props.angleHighlight
    )
  }

  render() {
    return (
      <div id="diagram">
        <div className="label a" style={{color: this.getDiagramColor(this.props.aHighlight)}}>A</div>
        <div className="label b" style={{color: this.getDiagramColor(this.props.bHighlight)}}>B</div>
        <div className="label c" style={{color: this.getDiagramColor(this.props.cHighlight)}}>C</div>
        <TriangleGraphic
          aLength={DIAGRAM_SIDE_LENGTH}
          bLength={DIAGRAM_SIDE_LENGTH}
          cLength={DIAGRAM_SIDE_LENGTH}
          width={DIAGRAM_WIDTH}
          height={DIAGRAM_HEIGHT}
          padding={DIAGRAM_MARGIN}
          angleFontSize={ANGLE_FONT_SIZE}
          angleColor={this.getDiagramColor(this.props.angleHighlight)}
          angleLabel={THETA}
          aElement={this.sideElement(DIAGRAM_A_UNIT, this.props.aHighlight)}
          bElement={this.sideElement(DIAGRAM_B_UNIT, this.props.bHighlight)}
          cElement={this.sideElement(DIAGRAM_C_UNIT, this.props.cHighlight)}
        />
      </div>
    );
  }
}

class TripleCalculator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sideConfigs: SIDES.map((i) => {return new SideConfig(i)}),
      aHighlight: false,
      bHighlight: false,
      cHighlight: false,
      angleHighlight: false,
      allowOver: true,
      allowUnder: true,
      desiredAngle: null
    };
  }

  updateSideConfig(updatedSide, updateFunction, newValue) {
    const newConfig = updateFunction(this.state.sideConfigs[updatedSide], newValue)
    console.log("Config for side " + updatedSide + " changed to " + newConfig)
    this.setState(
      {
        sideConfigs: SIDES.map(
          (i) => {
            return i == updatedSide ? newConfig : this.state.sideConfigs[i];
          }
        )
      }
    );
  }

  setMaxLength(sideIndex, maxLength) {
    this.updateSideConfig(
      sideIndex,
      this.state.sideConfigs[sideIndex].updateMaxLength(maxLength)
    )
    console.log("Max side " + sideIndex + " set to " + maxLength);
  }

  setUnits(sideIndex, unit) {
    this.updateSideConfig(
      sideIndex,
      this.state.sideConfigs[sideIndex].updateUnits(unit)
    )
    console.log("Units for side " + sideIndex + " set to " + unit.toString());
  }

  setConstrain(sideIndex, constrain) {
    this.updateSideConfig(
      sideIndex,
      this.state.sideConfigs[sideIndex].updateConstrain(constrain)
    )
    console.log("Output unit constraint for " + sideIndex + " set to " + constrain);
  }

  setDesiredAngle(desiredAngle) {
    this.setState({desiredAngle: desiredAngle});
    console.log("Desired angle set to " + desiredAngle);
  }

  setAllowOverUnder(allowOver, allowUnder) {
    this.setState(
      {
        allowUnder: allowUnder,
        allowOver: allowUnder
      }
    );
    console.log("Allow over set to " + allowOver + " and allow under set to " + allowUnder);
  }

  setAHighlight(highlight) {
    this.setState({aHighlight: highlight})
  }

  setBHighlight(highlight) {
    this.setState({bHighlight: highlight})
  }

  setCHighlight(highlight) {
    this.setState({cHighlight: highlight})
  }

  setAngleHighlight(highlight) {
    this.setState({angleHighlight: highlight})
  }

  renderSideInput(index, sideName, hoverCallback) {
    return (
      <SideInput
        sideName={sideName}
        maxLength={this.state.sideConfigs[index].maxLength}
        unit={this.state.sideConfigs[index].unit}
        constrainOutput={this.state.sideConfigs[index].constrain}
        maxLengthCallback={this.updateSideConfig.bind(this, index, (s, l) => {return s.updateMaxLength(l)})}
        unitCallback={this.updateSideConfig.bind(this, index, (s, u) => {return s.updateUnit(u)})}
        constrainCallback={this.updateSideConfig.bind(this, index, (s, c) => {return s.updateConstrain(c)})}
        hoverCallback={hoverCallback}
      />
    );
  }

  canCalculate() {
    return this.state.desiredAngle && this.state.sideConfigs.reduce(
      (accumulator, currentValue) => {
        return accumulator + (currentValue.maxLength == null ? 0 : 1);
      },
      0
    ) >= 2;
  }

  calculateOnClick() {
    this.props.calculatingCallback();
    setTimeout(this.calculateTriples.bind(this), 200);
  }

  calculateTriples() {
    this.props.setTripleGroups(
      calculateTriples(
        this.state.sideConfigs,
        this.state.desiredAngle,
        this.state.allowOver,
        this.state.allowUnder
      )
    );
  }

  render() {
    return (
      <div className="inputs">
        {this.renderSideInput(A, "A", this.setAHighlight.bind(this))}
        {this.renderSideInput(B, "B", this.setBHighlight.bind(this))}
        {this.renderSideInput(C, "C", this.setCHighlight.bind(this))}
        <AngleInput
          desiredAngle={this.state.desiredAngle}
          desiredAngleCallback={this.setDesiredAngle.bind(this)}
          allowOver={this.state.allowOver}
          allowUnder={this.state.allowUnder}
          allowOverUnderCallback={this.setAllowOverUnder.bind(this)}
          hoverCallback={this.setAngleHighlight.bind(this)}
        />
        <CalculateButton
          enabled={this.canCalculate()}
          onClick={this.calculateOnClick.bind(this)}
        />
        <Diagram
          aHighlight={this.state.aHighlight}
          bHighlight={this.state.bHighlight}
          cHighlight={this.state.cHighlight}
          angleHighlight={this.state.angleHighlight}
        />
        <hr/>
      </div>
    );
  }
}

export default TripleCalculator;