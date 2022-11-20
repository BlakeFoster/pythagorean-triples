import React from "react";
import SideInput from "./SideInput";
import AngleInput from "./AngleInput";
import CalculateButton from "./CalculateButton";
import { Unit } from "../../model/Unit";
import VertexTypeControl from "./VertexTypeControl"
import TriangleGraphic from "../graphics/TriangleGraphic";
import { THETA, A, B, C, SIDES } from "../../constants";
import { plain } from "../graphics/SideElement";
import calculateTriples from "../../lib/algorithm";
import SideConfig from "../../model/SideConfig";
import AngleConfig from "../../model/AngleConfig"
import { HINGE_PLATE }  from "../../model/VertexConfig"


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
    );
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
      angleConfig: new AngleConfig(),
      vertexConfig: HINGE_PLATE,
      aHighlight: false,
      bHighlight: false,
      cHighlight: false,
      angleHighlight: false
    };
  }

  updateSideConfig(updatedSide, newConfig) {
    console.log("Config for side " + updatedSide + " changed to " + newConfig)
    this.setState(
      {
        sideConfigs: SIDES.map(
          (i) => i === updatedSide ? newConfig : this.state.sideConfigs[i]
        )
      }
    );
  }

  updateAngleConfig(newConfig) {
    console.log("Config for desired angle changed to " + newConfig)
    this.setState({angleConfig: newConfig});
  }

  setVertexConfig(vertexConfig) {
    console.log("Vertex type set to " + vertexConfig);
    this.setState({vertexConfig: vertexConfig})
    if (vertexConfig.requiredUnit) {
      const newSideConfigs = SIDES.map(
        (i) => {
          return this.state.sideConfigs[i].updateRequestedUnit(vertexConfig.requiredUnit).updateConstrain(true)
        }
      )
      console.log(
        "Updating all side configs." +
        "\nA: " + newSideConfigs[A].toString() +
        "\nB: " + newSideConfigs[B].toString() +
        "\nC: " + newSideConfigs[C].toString()
      );
      this.setState(
        {
          sideConfigs: newSideConfigs
        }
      );
    }
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
        config={this.state.sideConfigs[index]}
        updateConfig={this.updateSideConfig.bind(this, index)}
        hoverCallback={hoverCallback}
        enableUnit={this.state.vertexConfig.requiredUnit == null}
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
        this.state.vertexConfig
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
          config={this.state.angleConfig}
          updateConfig={this.updateAngleConfig.bind(this)}
          hoverCallback={this.setAngleHighlight.bind(this)}
        />
        <VertexTypeControl
          vertexConfig={this.state.vertexConfig}
          setVertexConfig={this.setVertexConfig.bind(this)}
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