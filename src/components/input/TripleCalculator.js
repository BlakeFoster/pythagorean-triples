import React from "react";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch"
import SideInput from "./SideInput";
import InputGroup from "./InputGroup";
import NumericTextField from "./NumericTextField";
import Triple from "../../model/Triple";
import { STUDS, Unit } from "../../model/Unit"
import TriangleGraphic from "../graphics/TriangleGraphic"
import { DEGREES, THETA } from "../../constants"
import { plain } from "../graphics/SideElement"

function OverUnderSwitch(props) {
  return (<><Switch size="small" checked={props.isAllowed} onChange={() => {props.callback(!props.isAllowed)}}/> {props.label}</>);
}

const DIAGRAM_WIDTH = 480;
const DIAGRAM_HEIGHT = 480;
const DIAGRAM_MARGIN = 50;

const DIAGRAM_A_UNIT = new Unit("A", 4)
const DIAGRAM_B_UNIT = new Unit("B", 3)
const DIAGRAM_C_UNIT = new Unit("C", 5)
const DIAGRAM_SIDE_LENGTH = 1

const DIAGRAM_HOVER_COLOR = "rgb(255, 190, 70)"
const DIAGRAM_NORMAL_COLOR = "lightgrey"

const ANGLE_FONT_SIZE = "30"

const A = 0;
const B = 1;
const C = 2;

class TripleCalculator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      maxLengths: new Array(3).fill(null),
      units: new Array(3).fill(STUDS),
      desiredAngle: null,
      allowOver: true,
      allowUnder: true,
      angleInputLength: 0,
      angleInputTop: 0,
      aElement: this.sideElement(DIAGRAM_A_UNIT),
      bElement: this.sideElement(DIAGRAM_B_UNIT),
      cElement: this.sideElement(DIAGRAM_C_UNIT),
      angleColor: DIAGRAM_NORMAL_COLOR,
      aLabelColor: DIAGRAM_NORMAL_COLOR,
      bLabelColor: DIAGRAM_NORMAL_COLOR,
      cLabelColor: DIAGRAM_NORMAL_COLOR
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

  getDiagramColor(highlight) {
    return highlight ? DIAGRAM_HOVER_COLOR : DIAGRAM_NORMAL_COLOR;
  }

  sideElement(unit, highlight = false) {
    return plain(unit, this.getDiagramColor(highlight));
  }

  setAElement(highlight) {
    console.log("Side A highlight set to " + highlight)
    this.setState(
      {
        aElement: this.sideElement(DIAGRAM_A_UNIT, highlight),
        aLabelColor: this.getDiagramColor(highlight)
      }
    )
  }

  setBElement(highlight) {
    console.log("Side B highlight set to " + highlight)
    this.setState(
      {
        bElement: this.sideElement(DIAGRAM_B_UNIT, highlight),
        bLabelColor: this.getDiagramColor(highlight)
      }
    )
  }

  setCElement(highlight) {
    console.log("Side C highlight set to " + highlight)
    this.setState(
      {
        cElement: this.sideElement(DIAGRAM_C_UNIT, highlight),
        cLabelColor: this.getDiagramColor(highlight)
      }
    )
  }

  setAngleColor(highlight) {
    console.log("Angle highlight set to " + highlight)
    this.setState({angleColor: this.getDiagramColor(highlight)})
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
    console.log(input.style.padding)
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

    const l1Max = maxLengths[l1Index];
    const l2Max = maxLengths[l2Index];
    const l3Max = maxLengths[l3Index] == null ? Number.MAX_VALUE : maxLengths[l3Index];

    const l1Unit = this.state.units[l1Index];
    const l2Unit = this.state.units[l2Index];
    const l3Unit = this.state.units[l3Index];

    var tripleGroups = new Map()

    for (var l1=1; l1<=l1Max; l1++) {
      for (var l2=1; l2<=l2Max; l2++) {

        var triple = Triple.from2Sides(l1Index, l1, l1Unit, l2Index, l2, l2Unit, l3Index, l3Unit);

        const l3 = triple.getValue(l3Index).length;

        if (l3 > 0 && l3 <= l3Max && triple.isPythagorean()) {
          const angleDifference = triple.getAngle() - this.state.desiredAngle;
          if ((angleDifference >= 0 || this.state.allowUnder) && (angleDifference <= 0 || this.state.allowOver)) {
            const key = triple.hashKey();
            var tripleGroup = tripleGroups.get(key);
            if (tripleGroup == null) {
              tripleGroup = new Map();
              tripleGroups.set(key, tripleGroup);
            }
            tripleGroup.set(triple.getGCD(), triple);
          }
        }
      }
    }
    return this.sortTriples(tripleGroups);
  }

  sortTriples(tripleGroups) {
    tripleGroups = Array.from(tripleGroups.values());
    tripleGroups.sort(
      (a, b) => {
        return a.get(1).compareTo(b.get(1), this.state.desiredAngle)
      }
    );
    if (tripleGroups.length > 10) {
      console.log("Truncating to top 10")
      tripleGroups = tripleGroups.slice(0, 10);
    }
    tripleGroups = tripleGroups.map(
      (tripleGroup) => {
        var keys = Array.from(tripleGroup.keys());
        keys.sort();
        return keys.map(
          (key) => {
            return tripleGroup.get(key)
          }
        );
      }
    )
    tripleGroups.forEach(
      (tripleGroup) => {
        console.log("Found triple group with angle " + tripleGroup[0].getAngle())
        tripleGroup.forEach(
          (triple) => {console.log("  Found triple " + triple.toString())}
        )
      }
    )
    this.props.setTripleGroups(tripleGroups);
  }

  render() {
    return (
      <div className="inputs">
        {this.renderSideInput(A, "A", this.setAElement.bind(this))}
        {this.renderSideInput(B, "B", this.setBElement.bind(this))}
        {this.renderSideInput(C, "C", this.setCElement.bind(this))}
        <InputGroup label="Desired Angle" hoverCallback={this.setAngleColor.bind(this)}>
          <div className="angleControls">
            <div>
              <div className="angleControlGroup" ref={this.angleControlGroupRef}>
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
              <div className="angleControlGroup">
                <OverUnderSwitch
                  isAllowed={this.state.allowOver}
                  label="Allow Over" callback={this.setAllowOver.bind(this)}
                /><br/>
                <OverUnderSwitch
                  isAllowed={this.state.allowUnder}
                  label="Allow Under"
                  callback={this.setAllowUnder.bind(this)}
                />
              </div>
            </div>
          </div>
        </InputGroup>
        <InputGroup>
          <Button
            variant="contained"
            color="warning"
            disabled={!this.canCalculate()}
            onClick={this.calculateTriples.bind(this)}
          >Calculate</Button>
          <div className="helpMessage">{this.getHelpMessage()}</div>
        </InputGroup>
        <div id="diagram">
          <div className="label a" style={{color: this.state.aLabelColor}}>A</div>
          <div className="label b" style={{color: this.state.bLabelColor}}>B</div>
          <div className="label c" style={{color: this.state.cLabelColor}}>C</div>
          <TriangleGraphic
            aLength={DIAGRAM_SIDE_LENGTH}
            bLength={DIAGRAM_SIDE_LENGTH}
            cLength={DIAGRAM_SIDE_LENGTH}
            width={DIAGRAM_WIDTH}
            height={DIAGRAM_HEIGHT}
            padding={DIAGRAM_MARGIN}
            angleFontSize={ANGLE_FONT_SIZE}
            angleColor={this.state.angleColor}
            angleLabel={THETA}
            aElement={this.state.aElement}
            bElement={this.state.bElement}
            cElement={this.state.cElement}
          />
        </div>
        <hr/>
      </div>
    );
  }
}

export default TripleCalculator;