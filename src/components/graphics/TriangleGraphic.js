import React from "react";
import Side from "./Side";
import { Stage, Layer, Text, Arc } from 'react-konva';

import { RENDER_UNIT } from "./SideElement"
import { sind, cosd } from "../../lib/math"

const ANGLE_LABEL_DISTANCE = 10;
const ARC_WIDTH = 2;


class TriangleGraphic extends React.Component {
  render() {
    const aElementWidth = this.props.aElement.getWidth()
    const bElementWidth = this.props.bElement.getWidth();
    const cElementWidth = this.props.cElement.getWidth();

    const aLength = this.props.triple.getA().lengthIn(RENDER_UNIT);
    const bLength = this.props.triple.getB().lengthIn(RENDER_UNIT);

    const angle = this.props.triple.getAngle();
    const leftOverhangLengthStuds = sind(angle) * cElementWidth;
    const rightOverhangLengthStuds = bElementWidth;
    const topOverhangeHeightStuds = cosd(angle) * cElementWidth;
    const bottomOverhangHeightStuds = aElementWidth;

    const diagramWidthStuds = aLength + rightOverhangLengthStuds + leftOverhangLengthStuds;
    const diagramHeightStuds = bLength + bottomOverhangHeightStuds + topOverhangeHeightStuds;

    const maxHorizontalScale = (this.props.width - 2 * this.props.padding) / diagramWidthStuds;
    const maxVerticalScale = (this.props.height - 2 * this.props.padding) / diagramHeightStuds;
    const scale = Math.min(maxHorizontalScale, maxVerticalScale);

    const diagramWidth = diagramWidthStuds * scale;
    const diagramHeight = diagramHeightStuds * scale;
    const leftOverhangLength = leftOverhangLengthStuds * scale;
    const bottomOverhangHeight = bottomOverhangHeightStuds * scale

    const vertexX = (this.props.width - diagramWidth) / 2 + leftOverhangLength;
    const vertexY = this.props.height - (this.props.height - diagramHeight) / 2 - bottomOverhangHeight;

    const arcRadius = aLength * scale / 4;
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
              x={aLength}
              y={0}
              angle={180}
              length={this.props.triple.getA().length}
              displayElement={this.props.aElement}
            />
            {/* side B */}
            <Side
              x={aLength}
              y={bLength}
              angle={-90}
              length={this.props.triple.getB().length}
              displayElement={this.props.bElement}
            />
            {/* side C */}
            <Side
              x={0}
              y={0}
              angle={angle}
              length={this.props.triple.getC().length}
              displayElement={this.props.cElement}
            />
          </Layer>
        </Stage>
      </div>
    )
  }
}

export default TriangleGraphic;