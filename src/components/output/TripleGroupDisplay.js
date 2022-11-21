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

const ANGLE_LABEL_FONT_SIZE = 15;
const ANGLE_COLOR = "lightgrey";


class TripleGroupDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedTripleIndex: 0}
  }

  renderTripleGroupMenuItem(item, index) {
    return (
      <MenuItem
        value={index}
        key={
          [item.getA(), item.getB(), item.getC()].reduce(
            (acc, d) => d.physicalLength + d.unit.name + acc,
            "."
          )
        }
      >{item.toString()}</MenuItem>
    );
  }

  setTripleIndex(event) {
    this.setState({selectedTripleIndex: parseInt(event.target.value)})
  }

  cssClass() {
    return "normal";
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

  shouldShowButton() {
    return this.props.canZoom;
  }

  renderButton() {
    return this.shouldShowButton() ? (
      <div className="zoomCloseButton">
        <IconButton onClick={this.buttonAction.bind(this)}>{this.renderIcon()}</IconButton>
      </div>
    ) : null;
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
          {this.renderButton()}
        </div>
        <TriangleGraphic
          drawingRef={this.props.drawingRef}
          width={this.props.width}
          height={this.props.height}
          mountCallback={this.props.mountCallback}
          aOverhang={triple.getA().overhang}
          bOverhang={triple.getB().overhang}
          cOverhang={triple.getC().overhang}
          aLength={triple.getA().sideLength}
          bLength={triple.getB().sideLength}
          cLength={triple.getC().sideLength}
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