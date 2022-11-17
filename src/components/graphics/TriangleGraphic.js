import React from "react";
import Side from "./Side";
import { Stage, Layer, Text, Arc } from 'react-konva';

import { RENDER_UNIT } from "./SideElement"
import { sind, cosd, atan2d } from "../../lib/math"

const ANGLE_LABEL_DISTANCE = 10;
const ARC_WIDTH = 2;


class TriangleGraphic extends React.Component {
  render() {
    const aRelativeLength = this.props.aElement.LENGTH_UNIT.to(this.props.aLength, RENDER_UNIT);
    const bRelativeLength = this.props.bElement.LENGTH_UNIT.to(this.props.bLength, RENDER_UNIT);

    const angle = atan2d(bRelativeLength, aRelativeLength);
    const leftOverhangRelativeLength = sind(angle) * this.props.cElement.getWidth();
    const rightOverhangRelativeLength = this.props.bElement.getWidth();
    const topOverhangeRelativeHeight = cosd(angle) * this.props.cElement.getWidth();
    const bottomOverhangRelativeHeight = this.props.aElement.getWidth();

    const diagramRelativeWidth = aRelativeLength + rightOverhangRelativeLength + leftOverhangRelativeLength;
    const diagramRelativeHeight = bRelativeLength + bottomOverhangRelativeHeight + topOverhangeRelativeHeight;

    const maxHorizontalScale = (this.props.width - 2 * this.props.padding) / diagramRelativeWidth;
    const maxVerticalScale = (this.props.height - 2 * this.props.padding) / diagramRelativeHeight;
    const scale = Math.min(maxHorizontalScale, maxVerticalScale);

    const diagramWidth = diagramRelativeWidth * scale;
    const diagramHeight = diagramRelativeHeight * scale;
    const leftOverhangLength = leftOverhangRelativeLength * scale;
    const bottomOverhangHeight = bottomOverhangRelativeHeight * scale

    const vertexX = (this.props.width - diagramWidth) / 2 + leftOverhangLength;
    const vertexY = this.props.height - (this.props.height - diagramHeight) / 2 - bottomOverhangHeight;

    const arcRadius = aRelativeLength * scale / 4;
    const angleLabelRadius = arcRadius + ANGLE_LABEL_DISTANCE;

    return (
      <div className="drawingWrapper">
        <Stage width={this.props.width} height={this.props.height}>
          <Layer x={vertexX} y={vertexY} scaleX={1} scaleY={1}>
            <Text
              text={this.props.angleLabel}
              x={angleLabelRadius * cosd(angle / 2)}
              y={-angleLabelRadius * sind(angle / 2) - this.props.fontSize / 2}
              fontSize={this.props.fontSize}
              fill={this.props.angleColor}
            />
          </Layer>
          <Layer x={vertexX} y={vertexY} scaleX={1} scaleY={-1}>
            <Arc
              x={0}
              y={0}
              innerRadius={arcRadius}
              outerRadius={arcRadius + ARC_WIDTH}
              angle={angle}
              fill={this.props.angleColor}
            />
          </Layer>
          <Layer x={vertexX} y={vertexY} scaleX={scale} scaleY={-scale}>
            {/* side A */}
            <Side
              x={aRelativeLength}
              y={0}
              angle={180}
              length={this.props.aLength}
              displayElement={this.props.aElement}
            />
            {/* side B */}
            <Side
              x={aRelativeLength}
              y={bRelativeLength}
              angle={-90}
              length={this.props.bLength}
              displayElement={this.props.bElement}
            />
            {/* side C */}
            <Side
              x={0}
              y={0}
              angle={angle}
              length={this.props.cLength}
              displayElement={this.props.cElement}
            />
          </Layer>
        </Stage>
      </div>
    )
  }
}

export default TriangleGraphic;