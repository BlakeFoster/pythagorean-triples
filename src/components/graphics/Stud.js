import React from "react";
import { Circle } from "react-konva";

import { STUD_RADIUS, BRICK_STROKE_WIDTH } from "../../constants"


class Stud extends React.Component {
  render() {
    const { strokeScale = 1 } = this.props;
    return (
      <Circle
        x={this.props.x}
        y={this.props.y}
        stroke={this.props.color}
        strokeWidth={BRICK_STROKE_WIDTH * strokeScale}
        radius={STUD_RADIUS - (strokeScale - 1) * BRICK_STROKE_WIDTH / 2}
      />
    );
  }
}

export default Stud;