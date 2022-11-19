import React from "react";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch"
import Tooltip from "@mui/material/Tooltip"
import SideInput from "./SideInput";
import InputGroup from "./InputGroup";
import NumericTextField from "./NumericTextField";
import Triple from "../../model/Triple";
import { PLATES, STUDS, INTERNAL, Unit } from "../../model/Unit"
import TriangleGraphic from "../graphics/TriangleGraphic"
import { DEGREES, THETA } from "../../constants"
import { plain } from "../graphics/SideElement"
import Dimension from "../../model/Dimension"

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
      desiredAngle: null,
      allowOver: true,
      allowUnder: true,
      angleInputLength: 0,
      angleInputTop: 0,
      aHighlight: false,
      bHighlight: false,
      cHighlight: false,
      angleHighlight: false
    };
    this.angleInputRef = React.createRef();
    this.angleControlGroupRef = React.createRef();
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

  setAllowOver(allowOver) {
    this.setState(
      {
        allowUnder: this.state.allowUnder || !allowOver,
        allowOver: allowOver
      }
    );
  }

  setAllowUnder(allowUnder) {
    this.setState(
      {
        allowUnder: allowUnder,
        allowOver: this.state.allowOver || !allowUnder
      }
    );
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
        desiredAngle: desiredAngle,
        angleInputLength: width,
        angleInputTop: angleInputRect.top - angleControlGroupRect.top,
        angleInputPadding: padding
      }
    );
  }

  clampAngle() {
    if (this.state.desiredAngle != null) {
      this.setDesiredAngle(this.state.desiredAngle % 90);
    }
  }

  canCalculate() {
    return this.state.desiredAngle && this.state.maxLengths.reduce(
      (accumulator, currentValue) => {
        return accumulator + (currentValue == null ? 0 : 1);
      },
      0
    ) >= 2;
  }

  getHelpMessage() {
    return this.canCalculate() ? (<>&nbsp;</>) : (<>Choose at least 2 side lengths and the desired angle.</>);
  }


  getUnitOut(index, length) {
    const selectedUnit = this.state.units[index];
    if (this.state.constrain[index]) {
      return selectedUnit;
    } else {
      const lengthInSelectedUnit = selectedUnit.from(length, INTERNAL);
      if (lengthInSelectedUnit % 1 == 0) {
        return this.state.units[index];
      }
      const lengthInStuds = STUDS.from(length, INTERNAL);
      const unit = (lengthInStuds % 1) ? PLATES : STUDS;
      return unit;
    }
  }

  getMaxDimension(index) {
    const dimension = new Dimension(
      this.state.maxLengths[index] == null ?
        this.state.units[index].from(Number.MAX_VALUE - 1, INTERNAL) :
        this.state.maxLengths[index],
      this.state.units[index]
    );
    return this.state.constrain[index] ? dimension : dimension.to(INTERNAL);
  }

  calculateOnClick() {
    this.props.calculatingCallback();
    setTimeout(this.calculateTriples.bind(this), 100);
  }

  calculateTriples() {
    const maxLengths = this.state.maxLengths;
    var l1Index = 0;
    var l2Index = 1;
    var l3Index = 2;

    if (maxLengths[0] == null) {
      l1Index = 1;
      l2Index = 2;
      l3Index = 0;
    } else if (maxLengths[1] == null) {
      l1Index = 0;
      l2Index = 2;
      l3Index = 1;
    }

    const maxDim = new Array(3);
    for (var i=0; i<3; i++) {
      maxDim[i] = this.getMaxDimension(i);
    }

    const dimensions = new Array(3);
    var tripleGroups = new Map();

    console.log("Max dimensions: (" + new Triple(maxDim).toString() + ")")

    for (var l1=1; l1<=maxDim[l1Index].length; l1++) {
      const l1Unit = this.getUnitOut(l1Index, l1);
      const l1Dim = new Dimension(l1Unit.from(l1, maxDim[l1Index].unit), l1Unit);
      dimensions[l1Index] = l1Dim;

      for (var l2=1; l2<=maxDim[l2Index].length; l2++) {
        const l2Unit = this.getUnitOut(l2Index, l2);
        const l2Dim = new Dimension(l2Unit.from(l2, maxDim[l2Index].unit), l2Unit);
        dimensions[l2Index] = l2Dim
        const l3 = Math.sqrt(
          (l2Index === 2 ? -1 : 1) * l1Dim ** 2 +
          (l1Index === 2 ? -1 : 1) * l2Dim ** 2
        )
        const l3Unit = this.getUnitOut(l3Index, l3);
        const l3Dim = new Dimension(l3Unit.from(l3, INTERNAL), l3Unit);

        dimensions[l3Index] = l3Dim;
        const triple = new Triple([...dimensions])
        if (l3Dim > 0 && l3Dim <= maxDim[l3Index] && triple.isPythagorean()) {
          const angleDifference = triple.getAngle() - this.state.desiredAngle;
          if ((angleDifference >= 0 || this.state.allowUnder) && (angleDifference <= 0 || this.state.allowOver)) {
            const key = triple.hashKey();
            var tripleGroup = tripleGroups.get(key);
            if (tripleGroup == null) {
              tripleGroup = new Map();
              tripleGroups.set(key, tripleGroup);
            }
            tripleGroup.set(triple.to(INTERNAL).getGCD(), triple);
          }
        }
      }
    }
    var sortedGroups = new Array();
    for (let [key, tripleGroup] of tripleGroups.entries()) {
      var gcds = Array.from(tripleGroup.keys());
      gcds.sort();
      sortedGroups.push(
        gcds.map(
          (key) => {return tripleGroup.get(key)}
        )
      );
    }
    sortedGroups.sort(
      (a, b) => {
        return a[0].compareTo(b[0], this.state.desiredAngle)
      }
    );
    if (sortedGroups.length > 10) {
      console.log("Truncating to top 10")
      sortedGroups = sortedGroups.slice(0, 10);
    }
    sortedGroups.forEach(
      (tripleGroup) => {
        console.log("Found triple group with angle " + tripleGroup[0].getAngle())
        tripleGroup.forEach(
          (triple) => {console.log("  Found triple " + triple.toString())}
        )
      }
    )
    this.props.setTripleGroups(sortedGroups);
  }

  render() {
    return (
      <div className="inputs">
        {this.renderSideInput(A, "A", this.setAHighlight.bind(this))}
        {this.renderSideInput(B, "B", this.setBHighlight.bind(this))}
        {this.renderSideInput(C, "C", this.setCHighlight.bind(this))}
        <InputGroup label="Desired Angle" hoverCallback={this.setAngleHighlight.bind(this)}>
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
              value={this.state.desiredAngle}
              onChange={this.setDesiredAngle.bind(this)}
              onBlur={this.clampAngle.bind(this)}
              inputRef={this.angleInputRef}
            />
          </div>
          <div className="inputSettings">
            <OverUnderSwitch
              isAllowed={this.state.allowOver}
              label="Allow Over" callback={this.setAllowOver.bind(this)}
              tooltip="Include angles larger than the requested angle."
            />
            <br/>
            <OverUnderSwitch
              isAllowed={this.state.allowUnder}
              label="Allow Under"
              callback={this.setAllowUnder.bind(this)}
              tooltip="Include angles smaller than the requested angle."
            />
          </div>
        </InputGroup>
        <InputGroup>
          <div className="inputGroupContent">
            <Button
              variant="contained"
              color="warning"
              disabled={!this.canCalculate()}
              onClick={this.calculateOnClick.bind(this)}
            >Calculate</Button>
            <div className="helpMessage">{this.getHelpMessage()}</div>
          </div>
        </InputGroup>
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