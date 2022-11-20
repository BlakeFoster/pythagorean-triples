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
import AngleConfig from "../../model/AngleConfig"


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
      this.props.sideHighlight.reduce(
        (acc, current, index) => {return acc || (current !== nextProps.sideHighlight[index])},
        false
      ) || nextProps.angleHighlight !== this.props.angleHighlight
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
          aElement={this.sideElement(DIAGRAM_A_UNIT, this.props.sideHighlight[A])}
          bElement={this.sideElement(DIAGRAM_B_UNIT, this.props.sideHighlight[B])}
          cElement={this.sideElement(DIAGRAM_C_UNIT, this.props.sideHighlight[C])}
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
      angleConfig: new AngleConfig(),
      sideHighlight: new Array(3).fill(false),
      angleHighlight: false,
    };
  }

  updateSideConfig(updatedSide, newConfig) {
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

  updateAngleConfig(newConfig) {
    console.log("Config for desired angle changed to " + newConfig)
    this.setState({angleConfig: newConfig});
  }

  setSideHighlight(index, highlight) {
    this.setState(
      {
        sideHighlight: this.state.sideHighlight.map(
          (h, i) => {return i == index ? highlight : h}
        )
      }
    )
  }

  setAngleHighlight(highlight) {
    this.setState({angleHighlight: highlight})
  }

  renderSideInput(index, sideName, hoverCallback) {
    return (
      <SideInput
        sideName={sideName}
        config={this.state.sideConfigs[index]}
        updateConfig={this.updateSideConfig.bind(this, index)}
        hoverCallback={this.setSideHighlight.bind(this, index)}
      />
    );
  }

  canCalculate() {
    return this.state.angleConfig.desiredAngle && this.state.sideConfigs.reduce(
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
        this.state.angleConfig,
      )
    );
  }

  render() {
    return (
      <div className="inputs">
        {this.renderSideInput(A, "A")}
        {this.renderSideInput(B, "B")}
        {this.renderSideInput(C, "C")}
        <AngleInput
          config={this.state.angleConfig}
          updateConfig={this.updateAngleConfig.bind(this)}
          hoverCallback={this.setAngleHighlight.bind(this)}
        />
        <CalculateButton
          enabled={this.canCalculate()}
          onClick={this.calculateOnClick.bind(this)}
        />
        <Diagram
          sideHighlight={this.state.sideHighlight}
          angleHighlight={this.state.angleHighlight}
        />
        <hr/>
      </div>
    );
  }
}

export default TripleCalculator;