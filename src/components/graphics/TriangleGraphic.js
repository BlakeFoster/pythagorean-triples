import React from "react";
import { Stage, Layer, Rect, Text, Circle, Line, Arc } from 'react-konva';

import { INTERNAL, STUDS } from "../../model/Unit"

const STROKE_WIDTH = 0.05;
const ANGLE_LABEL_DISTANCE = 10;
const ARC_WIDTH = 2;


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


class TriangleGraphic extends React.Component {
  render() {
    const aLength = this.props.triple.getA().lengthIn(STUDS);
    const bLength = this.props.triple.getB().lengthIn(STUDS);
    const cLength = this.props.triple.getC().lengthIn(STUDS);

    const angle = this.props.triple.getAngle();
    const leftOverhangLength = Math.sin(angle * Math.PI / 180);
    const topOverhangeHeight = Math.cos(angle * Math.PI / 180);
    const diagramWidthStuds = aLength + 1 + leftOverhangLength;
    const diagramHeightStuds = bLength + 1 + topOverhangeHeight;

    const maxHorizontalScale = (this.props.width - 2 * this.props.padding) / diagramWidthStuds;
    const maxVerticalScale = (this.props.height - 2 * this.props.padding) / diagramHeightStuds;
    const scale = Math.min(maxHorizontalScale, maxVerticalScale);

    const vertexX = (this.props.width - diagramWidthStuds * scale) / 2 + leftOverhangLength * scale;
    const vertexY = this.props.height - (this.props.height - diagramHeightStuds * scale) / 2 - scale;

    const arcRadius = aLength * scale / 4;
    const angleLabelRadius = arcRadius + ANGLE_LABEL_DISTANCE;

    return (
      <div className="drawingWrapper">
        <Stage width={this.props.width} height={this.props.height}>
          <Layer x={vertexX} y={vertexY} scaleX={1} scaleY={1}>
            <Text
              text={this.props.angleLabel}
              x={angleLabelRadius * Math.cos(angle * Math.PI / 360)}
              y={-angleLabelRadius * Math.sin(angle * Math.PI / 360) - this.props.fontSize / 2}
              fontSize={this.props.fontSize}
              fill="lightgrey"
            />
          </Layer>
          <Layer x={vertexX} y={vertexY} scaleX={1} scaleY={-1}>
            <Arc
              x={0}
              y={0}
              innerRadius={arcRadius}
              outerRadius={arcRadius + ARC_WIDTH}
              angle={this.props.triple.getAngle()}
              fill="lightgrey"
            />
          </Layer>
          <Layer x={vertexX} y={vertexY} scaleX={scale} scaleY={-scale}>
            {/* side A */}
            <Side
              x={0}
              y={-1}
              angle={0}
              dimension={this.props.triple.getA()}
            />
            {/* side B */}
            <Side
              x={aLength + 1}
              y={0}
              angle={90}
              dimension={this.props.triple.getB()}
            />
            {/* side C */}
            <Side
              x={0}
              y={0}
              angle={angle}
              dimension={this.props.triple.getC()}
            />
          </Layer>
        </Stage>
      </div>
    )
  }
}

export default TriangleGraphic;