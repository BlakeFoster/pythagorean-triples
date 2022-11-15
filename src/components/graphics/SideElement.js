import React from "react";
import { Circle, Line, Group } from "react-konva";

import { STUDS, PLATES } from "../../model/Unit"
import BorderedRect from "./BorderedRect"

const BRICK_WIDTH_MM = 7.91;
const STUD_WIDTH_MM = 4.91;
const STUD_HEIGHT_MM = 1.75;

const STROKE_WIDTH = 0.05;
const STUD_RADIUS = STUD_WIDTH_MM / (2 * BRICK_WIDTH_MM) ;
const STUD_HEIGHT = STUD_HEIGHT_MM / BRICK_WIDTH_MM;

const UNIT = 1;

const PLATE_WIDTH = 1;
const PLATE_HEIGHT = PLATES.to(1, STUDS);

class _LegoElement extends React.Component {
  render() {
    return (
      <>
        <BorderedRect
          x={this.props.x}
          y={this.props.y}
          width={this.constructor.LENGTH}
          height={1}
          rotation={this.props.angle}
          stroke="black"
          strokeWidth={STROKE_WIDTH}
          fill="orange"
        />
        {this.renderDetail()}
      </>
    )
  }
}


export class PlateSide extends _LegoElement {
  renderDetail() {
    return (
      <BorderedRect
        x={this.props.x - STUD_HEIGHT}
        y={this.props.y + 0.5 - STUD_RADIUS}
        width={STUD_HEIGHT + STROKE_WIDTH}
        height={2 * STUD_RADIUS}
        stroke="black"
        fill="orange"
        strokeWidth={STROKE_WIDTH}
      />
    )
  }

  static LENGTH = PLATE_HEIGHT;
}


export class PlateTop extends _LegoElement {
  renderDetail() {
    return (
      <Circle
        x={this.props.x + 0.5}
        y={this.props.y + 0.5}
        stroke="black"
        strokeWidth={STROKE_WIDTH}
        radius={STUD_RADIUS}
      />
    );
  }

  static LENGTH = PLATE_WIDTH;
}
