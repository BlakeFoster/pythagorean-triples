import React from "react";
import Side from "./Side";
import { Stage, Layer, Text, Arc } from 'react-konva';

import { RENDER_UNIT } from "./SideElement"
import { sind, cosd, atan2d } from "../../lib/math"

const ANGLE_LABEL_DISTANCE = 12;
const ARC_WIDTH = 2;
const DRAWING_WIDTH = 450;
const DRAWING_HEIGHT = 400;
const DRAWING_MARGIN = 10;
const ANGLE_LABEL_FONT_SIZE = 15;
const BOX_PADDING = 15;


class TriangleGraphic extends React.Component {

  constructor(props) {
    super(props);
    this.state = {width: 0};
    this.wrapperRef = React.createRef();
    this.onResize = this.setDimensions.bind(this)
  }

  setDimensions() {

    if (this.wrapperRef.current) {
      const boundingRect = this.wrapperRef.current.getBoundingClientRect();
      this.setState(
        {
          width: boundingRect.width,
          height: boundingRect.height
        }
      )
      console.log("Updating dimensions to (" + boundingRect.width + ", " + boundingRect.height + ")");
    } else {
      console.log("Cannot update dimensions")
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize);
    this.setDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  renderCanvas() {
    if (!this.state.width || !this.state.height) {
      console.log("Not rendering, width and height not set");
      return null;
    }
    const width = this.state.width;
    const height = this.state.height;
    console.log("Rendering with width " + width + " and height " + height)
    const zoomScale = width / DRAWING_WIDTH;
    const angleFontSize = this.props.angleFontSize * zoomScale;
    const drawingMargin = DRAWING_MARGIN * zoomScale;

    const aRelativeLength = this.props.aElement.LENGTH_UNIT.to(this.props.aLength, RENDER_UNIT);
    const bRelativeLength = this.props.bElement.LENGTH_UNIT.to(this.props.bLength, RENDER_UNIT);

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

    const arcRadius = aRelativeLength * scale / 5;
    const angleLabelRadius = arcRadius + ANGLE_LABEL_DISTANCE;

    return (
      <Stage width={width} height={height}>
        <Layer x={vertexX} y={vertexY} scaleX={1} scaleY={1}>
          <Text
            text={this.props.angleLabel}
            x={angleLabelRadius * cosd(angle / 2)}
            y={-angleLabelRadius * sind(angle / 2) - this.props.angleFontSize / 2}
            fontSize={this.props.angleFontSize}
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
    );
  }

  render() {
    return (
      <div
        className="drawingWrapper"
        ref={this.wrapperRef}
      >
        {this.renderCanvas()}
      </div>
    );
  }
}

export default TriangleGraphic;