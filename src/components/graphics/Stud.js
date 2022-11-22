import React from "react";
import { Circle } from "react-konva";

import { STUD_RADIUS, BRICK_STROKE_WIDTH } from "../../constants"


class Stud extends React.Component {
  render() {
    return (
      <Circle
        x={this.props.x}
        y={this.props.y}
        stroke={this.props.color}
        strokeWidth={BRICK_STROKE_WIDTH}
        radius={STUD_RADIUS}
      />
    );
  }
}

export default Stud;