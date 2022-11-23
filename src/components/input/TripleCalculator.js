import React from "react";
import SideInput from "./SideInput";
import AngleInput from "./AngleInput";
import CalculateButton from "./CalculateButton";
import { Unit } from "../../model/Unit";
import VertexControl from "./VertexControl"
import TriangleGraphic from "../graphics/TriangleGraphic";
import { THETA, A, B, C, SIDES } from "../../constants";
import { plain } from "../graphics/SideElement";
import calculateTriples from "../../lib/algorithm";
import SideConfig from "../../model/SideConfig";
import AngleConfig from "../../model/AngleConfig"
import VertexConfig  from "../../model/VertexConfig"


const DIAGRAM_WIDTH = 490;
const DIAGRAM_HEIGHT = 300;
const DIAGRAM_MARGIN = 50;

const DIAGRAM_A_UNIT = new Unit("A", 4)
const DIAGRAM_B_UNIT = new Unit("B", 3)
const DIAGRAM_C_UNIT = new Unit("C", 5)
const DIAGRAM_SIDE_LENGTH = 1

const DIAGRAM_HOVER_COLOR = "rgb(255, 190, 70)"
const DIAGRAM_NORMAL_COLOR = "lightgrey"
const DIAGRAM_STROKE_WIDTH = 1 / 20;

const MIN_WIDTH_FOR_DIAGRAM = 970;

const ANGLE_FONT_SIZE = 30;


class Diagram extends React.Component {

  sideElement(unit, highlight = false) {
    return plain(unit, this.getDiagramColor(highlight), DIAGRAM_STROKE_WIDTH);
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
      vertexConfig: new VertexConfig(),
      aHighlight: false,
      bHighlight: false,
      cHighlight: false,
      angleHighlight: false,
      showDiagram: this.isWideEnoughForDiagram()
    };
    this.onResize = this.setShowDiagram.bind(this);
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
    this.setState({vertexConfig: vertexConfig});
  }

  setAHighlight(highlight) {
    if (highlight !== this.state.aHighlight) {
      this.setState({aHighlight: highlight})
    }
  }

  setBHighlight(highlight) {
    if (highlight !== this.state.bHighlight) {
      this.setState({bHighlight: highlight})
    }
  }

  setCHighlight(highlight) {
    if (highlight !== this.state.cHighlight)  {
      this.setState({cHighlight: highlight})
    }
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
        hoverCallback={this.state.showDiagram ? hoverCallback : null}
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
    this.props.setTripleGroups(null);
    this.props.calculatingCallback();
    setTimeout(this.calculateTriples.bind(this), 200);
  }

  calculateTriples() {
    const start = Date.now();
    const tripleGroups = calculateTriples(
      this.state.sideConfigs,
      this.state.angleConfig,
      this.state.vertexConfig
    )
    const end = Date.now();
    console.log("Completed in " + (end - start) + "ms")
    this.props.setTripleGroups(tripleGroups, this.state.angleConfig.desiredAngle);
  }

  renderDiagram() {
    return this.state.showDiagram ? (
      <Diagram
        aHighlight={this.state.aHighlight}
        bHighlight={this.state.bHighlight}
        cHighlight={this.state.cHighlight}
        angleHighlight={this.state.angleHighlight}
      />
    ) : null;
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  isWideEnoughForDiagram() {
    return window.innerWidth >= MIN_WIDTH_FOR_DIAGRAM;
  }

  setShowDiagram() {
    const showDiagram = this.isWideEnoughForDiagram()
    if (showDiagram !== this.state.showDiagram) {
      this.setState({showDiagram: showDiagram})
    }
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
          hoverCallback={this.state.showDiagram ? this.setAngleHighlight.bind(this) : null}
        />
        <VertexControl
          vertexConfig={this.state.vertexConfig}
          setVertexConfig={this.setVertexConfig.bind(this)}
          hasTripleGroups={this.props.hasTripleGroups}
          showVertices={this.props.showVertices}
          setShowVertices={this.props.setShowVertices}
        />
        <CalculateButton
          enabled={this.canCalculate()}
          onClick={this.calculateOnClick.bind(this)}
        />
        {this.renderDiagram()}
        <hr/>
      </div>
    );
  }
}

export default TripleCalculator;