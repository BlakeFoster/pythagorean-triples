import React from "react";
import Side from "./Side";
import { Stage, Layer, Text, Arc } from 'react-konva';

import { STUDS } from "../../model/Unit"

const ANGLE_LABEL_DISTANCE = 10;
const ARC_WIDTH = 2;

const Alias = Side;


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
            <Alias
              x={0}
              y={-1}
              angle={0}
              dimension={this.props.triple.getA()}
            />
            {/* side B */}
            <Alias
              x={aLength + 1}
              y={0}
              angle={90}
              dimension={this.props.triple.getB()}
            />
            {/* side C */}
            <Alias
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