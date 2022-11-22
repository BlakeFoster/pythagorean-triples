import React from "react";
import { Line } from "react-konva";

import { STUDS, PLATES, RENDER_UNIT, Unit } from "../../model/Unit"
import BorderedRect from "./BorderedRect";
import { STUD_RADIUS, STUD_HEIGHT, BRICK_STROKE_WIDTH, BRICK_STROKE_COLOR, BRICK_COLOR } from "../../constants";
import Stud from "./Stud"


class _SideElment extends React.Component {
  static getLength() {
    return this.LENGTH_UNIT.to(1, RENDER_UNIT);
  }

  static getWidth() {
    return this.WIDTH_UNIT.to(1, RENDER_UNIT);
  }
}


class _LegoElement extends _SideElment {
  render() {
    return (
      <>
        <BorderedRect
          x={this.props.x}
          y={this.props.y}
          width={this.constructor.getLength()}
          height={this.constructor.getWidth()}
          stroke={BRICK_STROKE_COLOR}
          strokeWidth={BRICK_STROKE_WIDTH}
          fill={BRICK_COLOR}
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
        y={this.props.y + 0.5 * this.constructor.getWidth() - STUD_RADIUS}
        width={STUD_HEIGHT + BRICK_STROKE_WIDTH}
        height={2 * STUD_RADIUS}
        stroke={BRICK_STROKE_COLOR}
        fill={BRICK_COLOR}
        strokeWidth={BRICK_STROKE_WIDTH}
      />
    )
  }

  static LENGTH_UNIT = PLATES;
  static WIDTH_UNIT = STUDS;
}


export class PlateTop extends _LegoElement {
  renderDetail() {
    return (
      <Stud
        x={this.props.x + 0.5 * this.constructor.getWidth()}
        y={this.props.y + 0.5 * this.constructor.getWidth()}
        color={BRICK_STROKE_COLOR}
        strokeWidth={BRICK_STROKE_WIDTH}
      />
    );
  }

  static LENGTH_UNIT = STUDS;
  static WIDTH_UNIT = STUDS;
}


export function plain (unit, color, stroke_width) {
  class Plain extends _SideElment {
    render() {
      return (
        <Line
          points={
            [
              this.props.x,
              this.props.y,
              this.props.x + this.constructor.getLength(),
              this.props.y
            ]
          }
          stroke={color}
          strokeWidth={stroke_width}
        />
      )
    }

    static LENGTH_UNIT = unit;
    static WIDTH_UNIT = new Unit("line", stroke_width);
  }

  return Plain;
}