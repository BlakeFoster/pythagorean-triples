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
    const maxHorizontalScale = (DRAWING_WIDTH - 2 * DRAWING_MARGIN) / triple.getA();
    const maxVerticalScale = (DRAWING_HEIGHT - 2 * DRAWING_MARGIN) / triple.getB();
    const scale = Math.min(maxHorizontalScale, maxVerticalScale);
    const aLength = triple.getA() * scale;
    const bLength = triple.getB() * scale;
    const cLength = triple.getC() * scale;
    const angle = triple.getAngle();
    const sideWidth = INTERNAL.from(1, STUDS) * scale;
    const leftOverhangLength = sideWidth * Math.sin(angle * Math.PI / 180);
    const topOverhangeHeight = sideWidth * Math.cos(angle * Math.PI / 180);
    const diagramWidth = aLength + sideWidth + leftOverhangLength;
    const diagramHeight = bLength + sideWidth + topOverhangeHeight;
    const vertexX = (DRAWING_WIDTH - diagramWidth) / 2 + leftOverhangLength;
    const vertexY = DRAWING_HEIGHT- (DRAWING_HEIGHT - diagramHeight) / 2 - sideWidth;


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
            <Layer x={vertexX} y={vertexY} scaleY={-1}>
              {/* side A */}
              <Rect x={0} y={-sideWidth} width={aLength} height={sideWidth} fill="red" />
              {/* side B */}
              <Rect x={aLength} y={0} width={sideWidth} height={bLength} fill="red" />
              {/* side C */}
              <Rect x={0} y={0} width={cLength} height={sideWidth} rotation={angle} fill="red"/>
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }
}

export default TripleGroupDisplay;