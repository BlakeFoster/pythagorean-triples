import TripleGroupDisplay from "./TripleGroupDisplay"
import CloseIcon from "@mui/icons-material/Close";

const DRAWING_WIDTH = 1170;
const DRAWING_HEIGHT = 1120;

class ZoomedTripleGroupDisplay extends TripleGroupDisplay {

  buttonAction() {
    this.props.toggleZoomed(null);
  }

  cssClass() {
    return "zoomed";
  }

  renderIcon() {
    return <CloseIcon/>
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