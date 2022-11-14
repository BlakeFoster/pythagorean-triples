import TripleGroupDisplay from "./TripleGroupDisplay"
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const DRAWING_WIDTH = 1170;
const DRAWING_HEIGHT = 1120;

class ZoomedTripleGroupDisplay extends TripleGroupDisplay {

  renderHeading() {
    return <IconButton onClick={this.close.bind(this)}><CloseIcon/></IconButton>
  }

  close() {
    this.props.toggleZoomed(null);
  }

  cssClass() {
    return "zoomed";
  }

  onClick() {}

  getDrawingWidth() {
    return DRAWING_WIDTH;
  }

  getDrawingHeight() {
    return DRAWING_HEIGHT;
  }

  render() {
    return (
      <div className="zoomWrapper">
         {super.render()}
      </div>
    );
  }
}

export default ZoomedTripleGroupDisplay;