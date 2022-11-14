import React from "react";

import { STUDS } from "../../model/Unit"
import { Rect, Circle, Line } from 'react-konva';

const STROKE_WIDTH = 0.05;


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

export default Side;