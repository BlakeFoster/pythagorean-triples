import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton"
import ZoomInTwoTone from "@mui/icons-material/ZoomInTwoTone";

import TriangleGraphic from "../graphics/TriangleGraphic"
import { DEGREES } from "../../constants"
import { PlateSide, PlateTop } from "../graphics/SideElement"
import { STUDS } from "../../model/Unit"

const DRAWING_WIDTH = 450;
const DRAWING_HEIGHT = 400;
const ASPECT_RATIO = DRAWING_WIDTH / DRAWING_HEIGHT;
const DRAWING_MARGIN = 10;
const ANGLE_LABEL_FONT_SIZE = 15;
const ANGLE_COLOR = "lightgrey";
const BOX_PADDING = 15;

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

  cssClass() {
    return "normal";
  }

  getDrawingHeight() {
    return DRAWING_HEIGHT;
  }

  getElement(side) {
      return side.unit === STUDS ? PlateTop : PlateSide;
  }

  renderIcon() {
    return <ZoomInTwoTone/>
  }

  buttonAction() {
    this.props.toggleZoomed(this.props.index);
  }

  render() {
    const variantLabelId = "variantLabel" + this.props.index;
    const triple = this.props.tripleGroup[this.state.selectedTripleIndex];

    return (
      <div className={"tripleGroupDisplay " + this.cssClass() + " parity" + this.props.index % 2}>
        <h1 className="tripleGroupHeading">
          {this.props.index + 1}.
        </h1>
        <div className="tripleGroupControls">
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
          <div className="zoomCloseButton">
            <IconButton onClick={this.buttonAction.bind(this)}>{this.renderIcon()}</IconButton>
          </div>
        </div>
        <TriangleGraphic
          aLength={triple.getA().length}
          bLength={triple.getB().length}
          cLength={triple.getC().length}
          aElement={this.getElement(triple.getA())}
          bElement={this.getElement(triple.getB())}
          cElement={this.getElement(triple.getC())}
          angleFontSize={ANGLE_LABEL_FONT_SIZE}
          angleColor={ANGLE_COLOR}
          angleLabel={Math.round(triple.getAngle() * 100) / 100 + DEGREES}
        />
      </div>
    );
  }
}

export default TripleGroupDisplay;