import React from "react";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch"
import SideInput from "./SideInput";
import InputGroup from "./InputGroup";
import NumericTextField from "./NumericTextField";
import Triple from "../../model/Triple";
import Dimension from "../../model/Dimension";
import { STUDS } from "../../model/Unit"
import TriangleGraphic from "../graphics/TriangleGraphic"
import { DEGREES, THETA } from "../../constants"

function OverUnderSwitch(props) {
  return (<><Switch size="small" checked={props.isAllowed} onChange={() => {props.callback(!props.isAllowed)}}/> {props.label}</>);
}

const DIAGRAM_WIDTH = 480;
const DIAGRAM_HEIGHT = 480;
const DIAGRAM_MARGIN = 50;
const DIAGRAM_TRIPLE = new Triple([new Dimension(4, STUDS), new Dimension(3, STUDS), new Dimension(5, STUDS)])

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
      angleInputTop: 0
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

  renderSideInput(index, sideName) {
    return (
      <SideInput
        sideName={sideName}
        maxLength={this.state.maxLengths[index]}
        unit={this.state.units[index]}
        maxLengthCallback={this.setMaxLength.bind(this, index)}
        unitCallback={this.setUnits.bind(this, index)}
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
        {this.renderSideInput(0, "A")}
        {this.renderSideInput(1, "B")}
        {this.renderSideInput(2, "C")}
        <InputGroup label="Desired Angle">
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
                  label="Alow Over" callback={this.setAllowOver.bind(this)}
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
          <TriangleGraphic
            triple={DIAGRAM_TRIPLE}
            width={DIAGRAM_WIDTH}
            height={DIAGRAM_HEIGHT}
            padding={DIAGRAM_MARGIN}
            fontSize={20}
            angleLabelFontStyle="italic"
            angleLabel={THETA}
          />
        </div>
        <hr/>
      </div>
    );
  }
}

export default TripleCalculator;