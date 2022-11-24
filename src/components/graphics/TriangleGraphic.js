import React from "react";
import Side from "./Side";
import { Stage, Layer, Text, Arc } from 'react-konva';

import { RENDER_UNIT } from "../../model/Unit"
import { sind, cosd, atan2d } from "../../lib/math"
import { VERTEX_COLOR, VERTEX_STROKE_SCALE } from "../../constants"
import Stud from "./Stud"
import { ZERO } from "../../model/Overhang"

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


function getBoundingBox(angle, lOffset, wOffset, sideWidth, sideLength) {

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

  renderVertex(x, y) {
    return (
      <Stud
        x={x}
        y={y}
        color={VERTEX_COLOR}
        strokeScale={VERTEX_STROKE_SCALE}
      />
    );
  }

  renderVertices(bTopX, bTopY) {
    return this.props.showVertices ? (
      <>
        {this.renderVertex(0, 0)}
        {this.renderVertex(bTopX, bTopY)}
        {this.renderVertex(bTopX, 0)}
      </>
    ) : null;
  }

  overhangToRenderUnit(overhang, element) {
    return overhang.transform(element.LENGTH_UNIT, RENDER_UNIT)
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

    const { aOverhang = ZERO, bOverhang = ZERO, cOverhang = ZERO } = this.props;

    const aOverhangR = this.overhangToRenderUnit(aOverhang, this.props.aElement);
    const bOverhangR = this.overhangToRenderUnit(bOverhang, this.props.bElement);
    const cOverhangR = this.overhangToRenderUnit(cOverhang, this.props.cElement);

//    const defaultOffset = -cOverhangR / 2;
//    const aReverseOffset = (-2 * aOverhangR + cOverhangR) / 2;
//    const reverseA = bOverhangR === 0;
//
//    const aX = reverseA ? aRelativeLength : 0;
//    const aY = reverseA ? 0 : -this.props.aElement.getWidth() - 2 * defaultOffset;
//    const aRotation = reverseA ? 180 : 0;
//    const aLOffset = reverseA ? aReverseOffset : defaultOffset;
//    const aWOffset = defaultOffset;
//    const bLOffset = defaultOffset;
//    const bWOffset = defaultOffset;
//    const cLOffset = defaultOffset;
//    const cWOffset = defaultOffset;

    const reverseA = false;

    const aX = reverseA ? aRelativeLength : 0;
    const aY = 0;

    const aRotation = reverseA ? 180 : 0;
    const aLOffset = reverseA ? aOverhangR.lShift : -aOverhangR.lShift //+ (reverseA ? -bOverhang.wShift : 0);
    const aWOffset = -aOverhangR.wShift;
    const bLOffset = -bOverhangR.lShift;
    const bWOffset = -bOverhangR.wShift;
    const cLOffset = -cOverhangR.lShift;
    const cWOffset = -cOverhangR.wShift;

    const angle = atan2d(bRelativeLength, aRelativeLength);

    const cBoundIngBox = getBoundingBox(
      angle,
      cLOffset,
      cWOffset,
      this.props.cElement.getWidth(),
      cRelativeLength
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

    const aLength = this.props.aLength + aOverhang.length
    const bLength = this.props.bLength + bOverhang.length
    const cLength = this.props.cLength + cOverhang.length

    console.log("Final side length " + aLength + " " + bLength + " " + cLength)
    console.log("Overhang length " + aOverhang + " " + bOverhang + " " + cOverhang)
    console.log("Raw side length" + this.props.aLength + " " + this.props.bLength + " " + this.props.cLength)

    return (
      <Stage width={width} height={height}>
        {arc}
        <Layer x={vertexX} y={vertexY} scaleX={scale} scaleY={-scale}>
          {/* side A */}
          <Side
            x={aX}
            y={aY}
            angle={aRotation}
            length={aLength}
            lOffset={aLOffset}
            wOffset={aWOffset}
            displayElement={this.props.aElement}
          />
          {/* side B */}
          <Side
            x={aRelativeLength}
            y={bRelativeLength}
            angle={-90}
            length={bLength}
            lOffset={bLOffset}
            wOffset={bWOffset}
            displayElement={this.props.bElement}
          />
          {/* side C */}
          <Side
            x={0}
            y={0}
            angle={angle}
            length={cLength}
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