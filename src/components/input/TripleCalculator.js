import React from "react";
import SideInput from "./SideInput";
import AngleInput from "./AngleInput";
import CalculateButton from "./CalculateButton";

import { STUDS, Unit } from "../../model/Unit"
import TriangleGraphic from "../graphics/TriangleGraphic"
import { THETA } from "../../constants"
import { plain } from "../graphics/SideElement"
import calculateTriples from "../../lib/algorithm"


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

const A = 0;
const B = 1;
const C = 2;

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
      maxLengths: new Array(3).fill(null),
      constrain: new Array(3).fill(true),
      units: new Array(3).fill(STUDS),
      aHighlight: false,
      bHighlight: false,
      cHighlight: false,
      angleHighlight: false,
      allowOver: true,
      allowUnder: true,
      desiredAngle: null
    };
  }

  updateItem(array, index, value) {
    var newArray = new Array(array.length);
    for (var i=0; i<array.length; i++) {
      newArray[i] = i === index ? value : array[i];
    }
    return newArray;
  }

  setMaxLength(sideIndex, maxLength) {
    this.setState({maxLengths: this.updateItem(this.state.maxLengths, sideIndex, maxLength)})
    console.log("Max side " + sideIndex + " set to " + maxLength);
  }

  setUnits(sideIndex, unit) {
    this.setState({units: this.updateItem(this.state.units, sideIndex, unit)});
    console.log("Units for side " + sideIndex + " set to " + unit.toString());
  }

  setConstrain(sideIndex, constrain) {
    this.setState({constrain: this.updateItem(this.state.constrain, sideIndex, constrain)});
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
        maxLength={this.state.maxLengths[index]}
        unit={this.state.units[index]}
        maxLengthCallback={this.setMaxLength.bind(this, index)}
        unitCallback={this.setUnits.bind(this, index)}
        hoverCallback={hoverCallback}
        constrainOutput={this.state.constrain[index]}
        constrainCallback={this.setConstrain.bind(this, index)}
      />
    );
  }

  canCalculate() {
    return this.state.desiredAngle && this.state.maxLengths.reduce(
      (accumulator, currentValue) => {
        return accumulator + (currentValue == null ? 0 : 1);
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
        this.state.maxLengths,
        this.state.desiredAngle,
        this.state.allowOver,
        this.state.allowUnder,
        this.state.units,
        this.state.constrain
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