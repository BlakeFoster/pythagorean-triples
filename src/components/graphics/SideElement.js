import React from "react";
import { Circle, Line } from "react-konva";

import { STUDS, PLATES, INTERNAL } from "../../model/Unit"
import BorderedRect from "./BorderedRect"

const BRICK_WIDTH_MM = 7.91;
const STUD_WIDTH_MM = 4.91;
const STUD_HEIGHT_MM = 1.75;

export const RENDER_UNIT = INTERNAL;

const STUD_RADIUS_RATIO = STUD_WIDTH_MM / (2 * BRICK_WIDTH_MM) ;
const STUD_HEIGHT_RATIO = STUD_HEIGHT_MM / BRICK_WIDTH_MM;

const STROKE_WIDTH_RATIO = 1 / 20;


class _SideElment extends React.Component {
  static getLength() {
    return this.LENGTH_UNIT.to(1, RENDER_UNIT);
  }

  static getWidth() {
    return this.WIDTH_UNIT.to(1, RENDER_UNIT);
  }

  getStrokeWidth () {
    return this.constructor.getWidth() * STROKE_WIDTH_RATIO;
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
          stroke="black"
          strokeWidth={this.getStrokeWidth()}
          fill="orange"
        />
        {this.renderDetail()}
      </>
    )
  }

  getStudRadius() {
    return this.constructor.getWidth() * STUD_RADIUS_RATIO;
  }

  getStudHeight() {
    return this.constructor.getWidth() * STUD_HEIGHT_RATIO;
  }
}


export class PlateSide extends _LegoElement {
  renderDetail() {
    return (
      <BorderedRect
        x={this.props.x - this.getStudHeight()}
        y={this.props.y + 0.5 * this.constructor.getWidth() - this.getStudRadius()}
        width={this.getStudHeight() + this.getStrokeWidth()}
        height={2 * this.getStudRadius()}
        stroke="black"
        fill="orange"
        strokeWidth={this.getStrokeWidth()}
      />
    )
  }

  static LENGTH_UNIT = PLATES;
  static WIDTH_UNIT = STUDS;
}


export class PlateTop extends _LegoElement {
  renderDetail() {
    return (
      <Circle
        x={this.props.x + 0.5 * this.constructor.getWidth()}
        y={this.props.y + 0.5 * this.constructor.getWidth()}
        stroke="black"
        strokeWidth={this.getStrokeWidth()}
        radius={this.getStudRadius()}
      />
    );
  }

  static LENGTH_UNIT = STUDS;
  static WIDTH_UNIT = STUDS;
}


export function plain (unit) {
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
          stroke="white"
          strokeWidth={this.getStrokeWidth()}
        />
      )
    }

    static LENGTH_UNIT = unit;
    static WIDTH_UNIT = INTERNAL;
  }

  return Plain;
}