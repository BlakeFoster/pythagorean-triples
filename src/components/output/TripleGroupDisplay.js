import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import TriangleGraphic from "../graphics/TriangleGraphic"
import { DEGREES } from "../../constants"

const DRAWING_WIDTH = 450;
const DRAWING_HEIGHT = 400;
const DRAWING_MARGIN = 10;
const ANGLE_LABEL_FONT_SIZE = 15;


class TripleGroupDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedTripleIndex: 0}
  }

  renderTripleGroupMenuItem(item, index) {
    return (
      <MenuItem
        value={index}
        key={item.toString()}
      >{item.toString()}</MenuItem>
    );
  }

  setTripleIndex(event) {
    this.setState({selectedTripleIndex: parseInt(event.target.value)})
  }

  renderHeading() {
    return <>{this.props.index + 1}.</>
  }

  cssClass() {
    return "normal";
  }

  onClick() {
    return this.props.toggleZoomed(this.props.index);
  }

  getDrawingWidth() {
    return DRAWING_WIDTH;
  }

  getDrawingHeight() {
    return DRAWING_HEIGHT;
  }

  render() {
    const drawingWidth = this.getDrawingWidth();
    const drawingHeight = this.getDrawingHeight();
    const zoomScale = drawingWidth / DRAWING_WIDTH;
    const drawingMargin = DRAWING_MARGIN * zoomScale;

    const variantLabelId = "variantLabel" + this.props.index;
    const triple = this.props.tripleGroup[this.state.selectedTripleIndex];

    const angleLabelFontSize = ANGLE_LABEL_FONT_SIZE * zoomScale;

    return (
      <div
        className={"tripleGroupDisplay " + this.cssClass() + " parity" + this.props.index % 2}
        onClick={this.onClick.bind(this)}
      >
        <h1 className="tripleGroupHeading">
          {this.renderHeading()}
        </h1>
        <div className="variantSelector">
          <FormControl size="small">
          <InputLabel id={variantLabelId}>Variant</InputLabel>
          <Select
            id={"variant" + this.props.index}
            variant="outlined"
            label="Variant"
            labelId={variantLabelId}
            value={this.state.selectedTripleIndex}
            onChange={this.setTripleIndex.bind(this)}
            disabled={this.props.tripleGroup.length <= 1}
          >
            {this.props.tripleGroup.map(this.renderTripleGroupMenuItem.bind(this))}
          </Select>
          </FormControl>
        </div>
        <TriangleGraphic
          triple={triple}
          width={drawingWidth}
          height={drawingHeight}
          padding={drawingMargin}
          fontSize={angleLabelFontSize}
          angleLabel={Math.round(triple.getAngle() * 100) / 100 + DEGREES}
        />
      </div>
    );
  }
}

export default TripleGroupDisplay;