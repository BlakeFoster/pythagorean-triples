import React from "react";
import Side from "./Side";
import { Stage, Layer, Text, Arc } from 'react-konva';

import { RENDER_UNIT } from "../../model/Unit"
import { sind, cosd, atan2d } from "../../lib/math"
import { VERTEX_COLOR } from "../../constants"
import Stud from "./Stud"

const ANGLE_LABEL_DISTANCE = 12;
const ARC_WIDTH = 2;
const DRAWING_WIDTH = 450;
const DRAWING_MARGIN = 20;


function matrixMult2x2(x, y, rotationMatrix) {
  return [
    rotationMatrix[0] * x + rotationMatrix[1] * y,
    rotationMatrix[2] * x + rotationMatrix[3] * y
  ]
}

function getCRotationMatrix(angle) {
  const cos = cosd(angle)
  const sin = sind(angle)
  return [cos, -sin, sin, cos]
}


function getBoundingBox(angle, lOffset, wOffset, sideWidth, sideLength, overhang) {

  const rotationMatrix = getCRotationMatrix(angle);

  const leftShiftX = lOffset;
  const bottomShiftY = wOffset;
  const rightShiftX = sideLength - lOffset;
  const topShiftY = sideWidth + wOffset;

  const bottomLeft = matrixMult2x2(leftShiftX, bottomShiftY, rotationMatrix)
  const bottomRight = matrixMult2x2(rightShiftX, bottomShiftY, rotationMatrix)
  const topLeft = matrixMult2x2(leftShiftX, topShiftY, rotationMatrix)
  const topRight = matrixMult2x2(rightShiftX, topShiftY, rotationMatrix)

  return {
    left: Math.min(topLeft[0], bottomRight[0]),
    bottom: Math.min(bottomLeft[1], topRight[1]),
    right: Math.max(topLeft[0], bottomRight[0]),
    top: Math.max(topLeft[1], topRight[1])
  }
}

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

  renderVertices(bTopX, bTopY) {
    return this.props.showVertices ? (
      <>
        <Stud
          x={0}
          y={0}
          color={VERTEX_COLOR}
        />
        <Stud
          x={bTopX}
          y={bTopY}
          color={VERTEX_COLOR}
        />
        <Stud
          x={bTopX}
          y={0}
          color={VERTEX_COLOR}
        />
      </>
    ) : null;
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
    const cRelativeLength = this.props.cElement.LENGTH_UNIT.to(this.props.cLength, RENDER_UNIT);

    console.log(
      "Rendering (" +
      this.props.aLength + " " + this.props.aElement.LENGTH_UNIT + ", " +
      this.props.bLength + " " + this.props.bElement.LENGTH_UNIT + ", " +
      this.props.cLength + " " + this.props.cElement.LENGTH_UNIT +
      " triangle with width " + width + " and height " + height
    );

    const { aOverhang = 0, bOverhang = 0, cOverhang = 0 } = this.props;

    const aOverhangR = RENDER_UNIT.from(aOverhang, this.props.aElement.LENGTH_UNIT)
    const bOverhangR = RENDER_UNIT.from(bOverhang, this.props.bElement.LENGTH_UNIT)
    const cOverhangR = RENDER_UNIT.from(cOverhang, this.props.cElement.LENGTH_UNIT)

    // Flip the stud direction for side A if it would overlap with side B. I have no idea why these formulas work.
    const defaultOffset = -cOverhangR / 2;
    const aReverseOffset = (-2 * aOverhangR + cOverhangR) / 2;
    const reverseA = bOverhangR === 0;

    const aX = reverseA ? aRelativeLength : 0;
    const aY = reverseA ? 0 : -this.props.aElement.getWidth() - 2 * defaultOffset;
    const aRotation = reverseA ? 180 : 0;
    const aLOffset = reverseA ? aReverseOffset : defaultOffset;
    const aWOffset = defaultOffset;
    const bLOffset = defaultOffset;
    const bWOffset = defaultOffset;
    const cLOffset = defaultOffset;
    const cWOffset = defaultOffset;

    const angle = atan2d(bRelativeLength, aRelativeLength);

    const cBoundIngBox = getBoundingBox(
      angle,
      cLOffset,
      cWOffset,
      this.props.cElement.getWidth(),
      cRelativeLength
      //this.props.cElement.getLength() * this.props.cLength
    )

    const boundingBoxLeft = cBoundIngBox.left;
    const boundingBoxRight = Math.max(cBoundIngBox.right, aRelativeLength + this.props.bElement.getWidth() + bWOffset);
    const boundingBoxTop = cBoundIngBox.top;
    const boundingBoxBottom = Math.min(cBoundIngBox.bottom, -this.props.aElement.getWidth() - aWOffset);
    const boundingBoxWidth = boundingBoxRight - boundingBoxLeft;
    const boundingBoxHeight = boundingBoxTop - boundingBoxBottom;

    const maxHorizontalScale = (width - 2 * drawingMargin) / boundingBoxWidth;
    const maxVerticalScale = (height - 2 * drawingMargin) / boundingBoxHeight;
    const scale = Math.min(maxHorizontalScale, maxVerticalScale);

    const diagramLeft = boundingBoxLeft * scale;
    const diagramBottom = boundingBoxBottom * scale;
    const diagramWidth = boundingBoxWidth * scale;
    const diagramHeight = boundingBoxHeight * scale;

    const vertexX = (width - diagramWidth) / 2 - diagramLeft;
    const vertexY = height - (height - diagramHeight) / 2 + diagramBottom;

    const arcRadius = aRelativeLength * scale / 5;
    const angleLabelRadius = arcRadius + ANGLE_LABEL_DISTANCE;
    const angleFontSize = this.props.angleFontSize * zoomScale;

    const arc = this.props.angleLabel ? (
      <>
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
      </>
    ) : null;

    return (
      <Stage width={width} height={height}>
        {arc}
        <Layer x={vertexX} y={vertexY} scaleX={scale} scaleY={-scale}>
          {/* side A */}
          <Side
            x={aX}
            y={aY}
            angle={aRotation}
            length={this.props.aLength + aOverhang}
            lOffset={aLOffset}
            wOffset={aWOffset}
            displayElement={this.props.aElement}
          />
          {/* side B */}
          <Side
            x={aRelativeLength}
            y={bRelativeLength}
            angle={-90}
            length={this.props.bLength + bOverhang}
            lOffset={bLOffset}
            wOffset={bWOffset}
            displayElement={this.props.bElement}
          />
          {/* side C */}
          <Side
            x={0}
            y={0}
            angle={angle}
            length={this.props.cLength + cOverhang}
            lOffset={cLOffset}
            wOffset={cWOffset}
            displayElement={this.props.cElement}
          />
          {this.renderVertices(aRelativeLength, bRelativeLength)}
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