import React from "react";
import Side from "./Side";
import { Stage, Layer, Text, Arc, Circle } from 'react-konva';

import { RENDER_UNIT } from "./SideElement"
import { sind, cosd, atan2d } from "../../lib/math"

const ANGLE_LABEL_DISTANCE = 12;
const ARC_WIDTH = 2;
const DRAWING_WIDTH = 450;
const DRAWING_MARGIN = 10;


class TriangleGraphic extends React.Component {

  constructor(props) {
    super(props);
    this.state = {width: 0};
  }

  componentDidMount() {
    if (this.props.mountCallback) {
      this.props.mountCallback();
    }
  }

  renderCanvas() {
    if (!this.props.width || !this.props.height) {
      console.log("Not rendering, width and height not set");
      return null;
    }
    const width = this.props.width;
    const height = this.props.height;

    const zoomScale = width / DRAWING_WIDTH;
    const drawingMargin = DRAWING_MARGIN * zoomScale;

    const aRelativeLength = this.props.aElement.LENGTH_UNIT.to(this.props.aLength, RENDER_UNIT);
    const bRelativeLength = this.props.bElement.LENGTH_UNIT.to(this.props.bLength, RENDER_UNIT);

    console.log(
      "Rendering (" +
      this.props.aLength + " " + this.props.aElement.LENGTH_UNIT + ", " +
      this.props.bLength + " " + this.props.bElement.LENGTH_UNIT + ", " +
      this.props.cLength + " " + this.props.cElement.LENGTH_UNIT +
      " triangle with width " + width + " and height " + height
    );

    const { aOverhang = 0, bOverhang = 0, cOverhang = 0 } = this.props;

    const angle = atan2d(bRelativeLength, aRelativeLength);
    const leftOverhangRelativeLength = sind(angle) * this.props.cElement.getWidth();
    const rightOverhangRelativeLength = this.props.bElement.getWidth();
    const topOverhangeRelativeHeight = cosd(angle) * this.props.cElement.getWidth();
    const bottomOverhangRelativeHeight = this.props.aElement.getWidth();

    const diagramRelativeWidth = aRelativeLength + rightOverhangRelativeLength + leftOverhangRelativeLength;
    const diagramRelativeHeight = bRelativeLength + bottomOverhangRelativeHeight + topOverhangeRelativeHeight;

    const maxHorizontalScale = (width - 2 * drawingMargin) / diagramRelativeWidth;
    const maxVerticalScale = (height - 2 * drawingMargin) / diagramRelativeHeight;
    const scale = Math.min(maxHorizontalScale, maxVerticalScale);

    const diagramWidth = diagramRelativeWidth * scale;
    const diagramHeight = diagramRelativeHeight * scale;
    const leftOverhangLength = leftOverhangRelativeLength * scale;
    const bottomOverhangHeight = bottomOverhangRelativeHeight * scale

    const vertexX = (width - diagramWidth) / 2 + leftOverhangLength;
    const vertexY = height - (height - diagramHeight) / 2 - bottomOverhangHeight;

    const bigAngleThreshold = 80;
    const smallAngleThreshold = 10;
    const smallAngleScaleFactor = Math.min(angle, smallAngleThreshold) / smallAngleThreshold;
    const bigAngleScaleFactor = Math.min(90 - angle, 90 - bigAngleThreshold) / (90 - bigAngleThreshold);
    const arcRadius = bigAngleScaleFactor * aRelativeLength * scale / (5 * smallAngleScaleFactor);
    const angleLabelRadius = arcRadius + ANGLE_LABEL_DISTANCE * bigAngleScaleFactor;
    const angleFontSize = this.props.angleFontSize * zoomScale * bigAngleScaleFactor;

    return (
      <Stage width={width} height={height}>
        <Layer x={vertexX} y={vertexY} scaleX={1} scaleY={1}>
          <Text
            text={this.props.angleLabel}
            x={angleLabelRadius * cosd(angle / 2)}
            y={-angleLabelRadius * sind(angle / 2) - this.props.angleFontSize / 2}
            fontSize={angleFontSize}
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
            length={this.props.aLength + aOverhang}
            lOffset={-aOverhang / 2}
            wOffset={-aOverhang / 2}
            displayElement={this.props.aElement}
          />
          {/* side B */}
          <Side
            x={aRelativeLength}
            y={bRelativeLength}
            angle={-90}
            length={this.props.bLength + bOverhang}
            lOffset={0}
            wOffset={-bOverhang / 2}
            lOffset={-bOverhang / 2}
            displayElement={this.props.bElement}
          />
          {/* side C */}
          <Side
            x={0}
            y={0}
            angle={angle}
            length={this.props.cLength + cOverhang}
            wOffset={-cOverhang / 2}
            lOffset={-cOverhang / 2}
            displayElement={this.props.cElement}
          />
          <Circle
            radius={0.3}
            stroke="blue"
            strokeWidth={0.3}
            x={0}
            y={0}
          />
          <Circle
            radius={0.3}
            stroke="blue"
            strokeWidth={0.3}
            x={aRelativeLength}
            y={bRelativeLength}
          />
          <Circle
            radius={0.3}
            stroke="blue"
            strokeWidth={0.3}
            x={aRelativeLength}
            y={0}
          />
        </Layer>
      </Stage>
    );
  }

  render() {
    return (
      <div
        className="drawingWrapper"
        ref={this.props.drawingRef}
      >
        {this.renderCanvas()}
      </div>
    );
  }
}

export default TriangleGraphic;