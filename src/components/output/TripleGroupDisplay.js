import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';

import { Stage, Layer, Rect, Text, Circle, Line, Arc } from 'react-konva';
import { INTERNAL, STUDS } from "../../model/Unit"

const DRAWING_WIDTH = 450;
const ZOOMED_DRAWING_WIDTH = 1170;
const DRAWING_HEIGHT = 400;
const ZOOMED_DRAWING_HEIGHT = 1120;
const DRAWING_MARGIN = 10;
const STROKE_WIDTH = 0.05;
const ARC_RADIUS = 100;
const ARC_WIDTH = 2;
const ANGLE_LABEL_DISTANCE = 10;
const ANGLE_LABEL_FONT_SIZE = 15;

class Side extends React.Component {
  renderRectangle() {
    const outerPadding = STROKE_WIDTH / 2;
    const offsetRadius = outerPadding * Math.sqrt(2);
    const offsetAngle = (this.props.angle + 45) * Math.PI / 180;
    const length = this.props.dimension.lengthIn(STUDS) - STROKE_WIDTH;
    const height = 1 - STROKE_WIDTH;
    const x = this.props.x + Math.cos(offsetAngle) * offsetRadius;
    const y = this.props.y + Math.sin(offsetAngle) * offsetRadius;

    return (
      <Rect
        x={x}
        y={y}
        width={length}
        height={height}
        rotation={this.props.angle}
        stroke="black"
        strokeWidth={STROKE_WIDTH}
        fill="orange"
      />
    );
  }

  renderSegments() {
    var numSegments = this.props.dimension.length;
    const angle = this.props.angle * Math.PI / 180;
    const length = this.props.dimension.lengthIn(STUDS);

    const x0 = this.props.x;
    const y0 = this.props.y;

    const x1 = this.props.x + length * Math.cos(angle);
    const y1 = this.props.y + length * Math.sin(angle);

    const segmentAngle = angle + Math.PI / 2;
    const segmentXOffset = Math.cos(segmentAngle);
    const segmentYOffset = Math.sin(segmentAngle);

    const dx = x1 - x0;
    const dy = y1 - y0;

    var segments = [];

    for (var i=1; i<numSegments; i+=1) {
      var lineX0 = this.props.x + (dx * i) / numSegments;
      var lineY0 = this.props.y + (dy * i) / numSegments;
      var lineX1 = lineX0 + segmentXOffset;
      var lineY1 = lineY0 + segmentYOffset;
      segments.push(
        <Line
          stroke="black"
          strokeWidth={STROKE_WIDTH * 2}
          points={[lineX0, lineY0, lineX1, lineY1]}
          key={"line" + lineX0 + "." + lineY0}
        />
      );
    }

    if (this.props.dimension.unit == STUDS) {
      for (var i=0; i<numSegments; i+=1) {
        var studX = x0 + segmentXOffset / 2 + (dx * (i + 0.5)) / numSegments;
        var studY = y0 + segmentYOffset / 2 + (dy * (i + 0.5)) / numSegments;
        segments.push(
          <Circle
            x={studX}
            y={studY}
            stroke="black"
            strokeWidth={STROKE_WIDTH}
            radius={0.3}
            key={"stud" + studX + "." + studY}
          />
        )
      }
    }

    return segments;
  }

  render() {
    return (
      <>
        {this.renderRectangle()}
        {this.renderSegments()}

      </>
    )
  }
}

class TripleGroupDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTripleIndex: 0,
      zoomed: false
    }
  }

  renderTripleGroupMenuItem(item, index) {
    return (
      <MenuItem
        value={index}
        key={item.toString()}
      >{item.toString()}</MenuItem>
    );
  }

  setTripleIndex(event) {
    this.setState({selectedTripleIndex: parseInt(event.target.value)})
  }

  renderNormal() {
    return this.renderDisplay(false);
  }

  renderZoomed() {
    return (
      <div className="zoomWrapper">
        {this.renderDisplay(true)}
      </div>
    );
  }

  renderHeading() {
    if (this.props.zoomed) {
      return <IconButton onClick={this.props.toggleZoomed}><CloseIcon/></IconButton>
    } else {
      return <>{this.props.number}.</>
    }
  }

  renderDisplay(zoomed) {
    const drawingWidth = zoomed ? ZOOMED_DRAWING_WIDTH : DRAWING_WIDTH;
    const drawingHeight = zoomed ? ZOOMED_DRAWING_HEIGHT : DRAWING_HEIGHT;
    const zoomScale = drawingWidth / DRAWING_WIDTH;
    const drawingMargin = DRAWING_MARGIN * zoomScale;

    const variantLabelId = "variantLabel" + this.props.index;
    const triple = this.props.tripleGroups[this.state.selectedTripleIndex];
    console.log("Drawing triple " + triple)

    const aLength = triple.getA().lengthIn(STUDS);
    const bLength = triple.getB().lengthIn(STUDS);
    const cLength = triple.getC().lengthIn(STUDS);

    const angle = triple.getAngle();
    const leftOverhangLength = Math.sin(angle * Math.PI / 180);
    const topOverhangeHeight = Math.cos(angle * Math.PI / 180);
    const diagramWidthStuds = aLength + 1 + leftOverhangLength;
    const diagramHeightStuds = bLength + 1 + topOverhangeHeight;

    const maxHorizontalScale = (drawingWidth - 2 * drawingMargin) / diagramWidthStuds;
    const maxVerticalScale = (drawingHeight - 2 * drawingMargin) / diagramHeightStuds;
    const scale = Math.min(maxHorizontalScale, maxVerticalScale);

    const vertexX = (drawingWidth - diagramWidthStuds * scale) / 2 + leftOverhangLength * scale;
    const vertexY = drawingHeight - (drawingHeight - diagramHeightStuds * scale) / 2 - scale;

    const arcRadius = aLength * scale / 4;
    const angleLabelRadius = arcRadius + ANGLE_LABEL_DISTANCE;

    const angleLabelFontSize = ANGLE_LABEL_FONT_SIZE * zoomScale;

    return (
      <div
        className={"tripleGroupDisplay " + (zoomed ? "zoomed" : "normal") + " parity" + this.props.number % 2}
        onClick={zoomed ? null : this.props.toggleZoomed}
      >
        <h1 className="tripleGroupHeading">
          {this.renderHeading()}
        </h1>
        <div className="variantSelector">
          <FormControl size="small">
          <InputLabel id={variantLabelId}>Variant</InputLabel>
          <Select
            id={"variant" + this.props.index}
            variant="outlined"
            label="Variant"
            labelId={variantLabelId}
            value={this.state.selectedTripleIndex}
            onChange={this.setTripleIndex.bind(this)}
            disabled={this.props.tripleGroups.length <= 1}
          >
            {this.props.tripleGroups.map(this.renderTripleGroupMenuItem.bind(this))}
          </Select>
          </FormControl>
        </div>
        <div className="drawingWrapper">
          <Stage width={drawingWidth} height={drawingHeight}>
            <Layer x={vertexX} y={vertexY} scaleX={1} scaleY={1}>
              <Text
                text={Math.round(triple.getAngle() * 100) / 100 + String.fromCharCode(176)}
                x={angleLabelRadius * Math.cos(triple.getAngle() * Math.PI / 360)}
                y={-angleLabelRadius * Math.sin(triple.getAngle() * Math.PI / 360) - angleLabelFontSize / 2}
                fontSize={angleLabelFontSize}
                fill="lightgrey"
              />
            </Layer>
            <Layer x={vertexX} y={vertexY} scaleX={1} scaleY={-1}>
              <Arc
                x={0}
                y={0}
                innerRadius={arcRadius}
                outerRadius={arcRadius + ARC_WIDTH}
                angle={triple.getAngle()}
                fill="lightgrey"
              />
            </Layer>
            <Layer x={vertexX} y={vertexY} scaleX={scale} scaleY={-scale}>
              {/* side A */}
              <Side
                x={0}
                y={-1}
                angle={0}
                dimension={triple.getA()}
              />
              {/* side B */}
              <Side
                x={aLength + 1}
                y={0}
                angle={90}
                dimension={triple.getB()}
              />
              {/* side C */}
              <Side
                x={0}
                y={0}
                angle={angle}
                dimension={triple.getC()}
              />
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }

  render() {
    return this.props.zoomed ?  this.renderZoomed() : this.renderNormal();
  }
}

export default TripleGroupDisplay;