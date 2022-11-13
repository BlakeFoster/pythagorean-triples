import React from "react";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography";
import SideInput from "./SideInput.js";
import InputGroup from "./InputGroup.js";
import NumericTextField from "./NumericTextField.js";
import Triple from "../../model/Triple.js";
import { STUDS } from "../../model/Unit.js"

function OverUnderSwitch(props) {
  return (<><Switch size="small" checked={props.isAllowed} onChange={() => {props.callback(!props.isAllowed)}}/> {props.label}</>);
}

class TripleCalculator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      maxLengths: new Array(3).fill(null),
      units: new Array(3).fill(STUDS),
      desiredAngle: null,
      allowOver: true,
      allowUnder: true
    };
  }

  updateItem(array, index, value) {
    var newArray = new Array(array.length);
    for (var i=0; i<array.length; i++) {
      newArray[i] = i == index ? value : array[i];
    }
    return newArray;
  }

  setMaxLength(sideIndex, maxLength) {

    this.setState({maxLengths: this.updateItem(this.state.maxLengths, sideIndex, maxLength)})
    console.log("Max side " + sideIndex + " set to " + maxLength);
  }

  setUnits(sideIndex, units) {
    this.setState({units: this.updateItem(this.state.units, sideIndex, units)});
    console.log("Units for side " + sideIndex + " set to " + units);
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
        units={this.state.units[index]}
        maxLengthCallback={this.setMaxLength.bind(this, index)}
        unitsCallback={this.setUnits.bind(this, index)}
      />);
  }

  setDesiredAngle(desiredAngle) {
    this.setState({desiredAngle: desiredAngle});
  }

  clampAngle() {
    if (this.state.desiredAngle != null) {
      this.setDesiredAngle(this.state.desiredAngle % 360);
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
    var l1Sign = 1;

    if (maxLengths[0] == null) {
      l1Index = 1;
      l2Index = 2;
      l3Index = 0;
      l1Sign = -1;
    } else if (maxLengths[1] == null) {
      l1Index = 0;
      l2Index = 2;
      l3Index = 1;
      l1Sign = -1;
    }

    const l1Max = maxLengths[l1Index];
    const l2Max = maxLengths[l2Index];
    const l3Max = maxLengths[l3Index] == null ? Number.MAX_VALUE : maxLengths[l3Index];

    const l1Unit = this.state.units[l1Index];
    const l2Unit = this.state.units[l2Index];
    const l3Unit = this.state.units[l3Index];

    var triples = new Map()

    for (var l1=1; l1<=l1Max; l1++) {
      for (var l2=1; l2<=l2Max; l2++) {
        var triple = new Triple(l1Index, l1, l1Unit, l2Index, l2, l2Unit, l3Index, l3Unit);
        const l3 = triple.getValue(l3Index).length;

        if (l3 > 0 && l3 <= l3Max && triple.isPythagorean) {
          const angleDifference = triple.angle - this.state.desiredAngle;
          if ((angleDifference >= 0 || this.state.allowUnder) && (angleDifference <= 0 || this.state.allowOver)) {
            if (!triples.get(triple.key)) {
              triples.set(triple.key, triple);
            }
          }
        }
      }
    }
    return this.sortTriples(Array.from(triples.values()));
  }

  sortTriples(triples) {
    triples.sort(
      (a, b) => a.compareTo(b, this.state.desiredAngle)
    );
    if (triples.length > 10) {
      console.log("Truncating to top 10")
      triples = triples.slice(0, 10);
    }
    for (var i=0; i<triples.length; i++) {
      console.log("Found triple " + triples[i].toString() + " (angle = " + triples[i].angle + ")");
    }
    return triples;
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
              <div className="angleControlGroup">
                <NumericTextField label="Angle" value={this.state.desiredAngle} onChange={this.setDesiredAngle.bind(this)} onBlur={this.clampAngle.bind(this)}/>
              </div>
              <div className="angleControlGroup">
                <OverUnderSwitch isAllowed={this.state.allowOver} label="Alow Over" callback={this.setAllowOver.bind(this)}/><br/>
                <OverUnderSwitch isAllowed={this.state.allowUnder} label="Allow Under" callback={this.setAllowUnder.bind(this)}/>
              </div>
            </div>
          </div>
        </InputGroup>
        <InputGroup>
          <Button variant="contained" color="warning" disabled={!this.canCalculate()} onClick={this.calculateTriples.bind(this)}>Calculate</Button>
          <div className="helpMessage">{this.getHelpMessage()}</div>
        </InputGroup>
        <hr/>
      </div>
    );
  }
}

export default TripleCalculator;