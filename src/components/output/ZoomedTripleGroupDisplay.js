import TripleGroupDisplay from "./TripleGroupDisplay"
import CloseIcon from "@mui/icons-material/Close";


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

  shouldShowButton() {
    return true;
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