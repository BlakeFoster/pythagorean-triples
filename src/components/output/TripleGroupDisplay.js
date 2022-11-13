import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';
import { INTERNAL, STUDS } from "../../model/Unit"

const DRAWING_WIDTH = 450;
const DRAWING_HEIGHT = 400;
const DRAWING_MARGIN = 70;
const STROKE_WIDTH = 0.1;

class Side extends React.Component {
  render() {
    const outerPadding = STROKE_WIDTH / 2;
    const radius = outerPadding * Math.sqrt(2);
    const radians = (45 + this.props.angle) * Math.PI / 180;

    return (
      <>
        <Rect
          x={this.props.x + Math.cos(radians) * radius}
          y={this.props.y + Math.sin(radians) * radius}
          width={this.props.length - STROKE_WIDTH}
          height={1 - STROKE_WIDTH}
          rotation={this.props.angle}
          stroke="black"
          strokeWidth={STROKE_WIDTH}
          fill="red"
        />
      </>
    )
  }
}

class TripleGroupDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedTripleIndex: 0}
  }

  renderTripleGroupMenuItem(item, index) {
    return (
      <MenuItem
        value={index}
        key={item.toString()}
      >{item.toString()}</MenuItem>
    );
  }

  render() {
    const variantLabelId = "variantLabel" + this.props.index;
    const triple = this.props.tripleGroups[this.state.selectedTripleIndex];
    console.log("Drawing triple " + triple)

    const aLength = triple.getA().lengthIn(STUDS);
    const bLength = triple.getB().lengthIn(STUDS);
    const cLength = triple.getC().lengthIn(STUDS);

    const maxHorizontalScale = (DRAWING_WIDTH - 2 * DRAWING_MARGIN) / aLength;
    const maxVerticalScale = (DRAWING_HEIGHT - 2 * DRAWING_MARGIN) / bLength;
    const scale = Math.min(maxHorizontalScale, maxVerticalScale);

    const angle = triple.getAngle();

    const leftOverhangLength = Math.sin(angle * Math.PI / 180);
    const topOverhangeHeight = Math.cos(angle * Math.PI / 180);
    const diagramWidth = (aLength + 1 + leftOverhangLength) * scale;
    const diagramHeight = (bLength + 1 + topOverhangeHeight) * scale;
    const vertexX = (DRAWING_WIDTH - diagramWidth) / 2 + leftOverhangLength * scale;
    const vertexY = DRAWING_HEIGHT - (DRAWING_HEIGHT - diagramHeight) / 2 - scale;


    return (
      <div className="tripleGroupDisplay">
        <h1 className="tripleGroupNumber">{this.props.number}.</h1>
        <div className="variantSelector">
          <FormControl size="small">
          <InputLabel id={variantLabelId}>Variant</InputLabel>
          <Select
            id={"variant" + this.props.index}
            variant="outlined"
            label="Variant"
            labelId={variantLabelId}
            value={this.state.selectedTripleIndex}
          >
            {this.props.tripleGroups.map(this.renderTripleGroupMenuItem.bind(this))}
          </Select>
          </FormControl>
        </div>
        <div className="drawingWrapper">
          <Stage width={DRAWING_WIDTH} height={DRAWING_HEIGHT}>
            <Layer x={vertexX} y={vertexY} scaleX={scale} scaleY={-scale}>
              {/* side A */}
              <Side x={0} y={-1} length={aLength} angle={0}/>
              {/* side B */}
              <Side x={aLength + 1} y={0} length={bLength} angle={90} />
              {/* side C */}
              <Side x={0} y={0} length={cLength} angle={angle}/>
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }
}

export default TripleGroupDisplay;