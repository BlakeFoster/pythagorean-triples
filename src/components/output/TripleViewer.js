import React from "react";
import Alert from "@mui/material/Alert";

import TripleGroupDisplay from "./TripleGroupDisplay";
import ZoomedTripleGroupDisplay from "./ZoomedTripleGroupDisplay";
import { ZOOM_MINIMUM_WIDTH } from "../../constants"
import leftArrow from "../../assets/leftArrow.svg"
import rightArrow from "../../assets/rightArrow.svg"
import leftArrowHover from "../../assets/leftArrowHover.svg"
import rightArrowHover from "../../assets/rightArrowHover.svg"
import leftArrowDisabled from "../../assets/leftArrowDisabled.svg"
import rightArrowDisabled from "../../assets/rightArrowDisabled.svg"
import leftArrowActive from "../../assets/leftArrowActive.svg"
import rightArrowActive from "../../assets/rightArrowActive.svg"

class ArrowButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {image: this.props.image};
  }

  static getDerivedStateFromProps(props, state) {
    return {image: props.enabled ? state.image : props.disabledImage}
  }

  setImage(image) {
    this.setState({image: image});
  }

  render() {
    return (
      <button
        className={"arrowButton " + this.props.className + (this.props.enabled ? "" : " disabled")}
        style={{backgroundImage: "url(" + this.state.image + ")"}}
        onMouseEnter={this.setImage.bind(this, this.props.hoverImage)}
        onMouseLeave={this.setImage.bind(this, this.props.image)}
        onMouseDown={this.setImage.bind(this, this.props.activeImage)}
        onMouseUp={this.setImage.bind(this, this.props.hoverImage)}
        disabled={false}
      >
        <div
          className="arrowButtonLabel"
        >{this.props.label}</div>
      </button>
    );
  }
}

class TripleViewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      zoomedGroupIndex: null,
      drawing1Width: 0,
      drawing1Height: 0,
      drawingZoomedWidth: 0,
      drawingZoomedHeight: 0,
      canZoom: this.isWideEnoughForZoom(),
      page: 0
    }
    this.drawing1Ref = React.createRef();
    this.drawingZoomedRef = React.createRef();
    this.onResize = this.setDimensions.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.tripleGroups !== nextProps.tripleGroups) {
      console.log("Triple groups changed");
      return true
    } else if (this.props.showVertices !== nextProps.showVertices) {
      console.log("Show vertices changed");
      return true
    } else if (this.state.zoomedGroupIndex !== nextState.zoomedGroupIndex) {
      console.log("Zoomed group changed");
      return true
    } else if (this.state.drawing1Width !== nextState.drawing1Width) {
      console.log("Drawing width changed");
      return true
    } else if (this.state.drawingZoomedWidth !== nextState.drawingZoomedWidth) {
      console.log("Zoomed drawing height changed");
      return true
    } else if (this.state.drawingZoomedHeight !== nextState.drawingZoomedHeight) {
      console.log("Zoomed drawing height changed");
      return true
    } else if (this.state.canZoom !== nextState.canZoom) {
      console.log("Zoom enabled changed");
      return true
    } else {
      return false;
    }
  }

//  static getDerivedStateFromProps(props, state) {
//    if (!props.tripleGroups && state.page != 0) {
//      return {page: 0}
//    }
//  }

  renderErrorMessage() {
    return this.props.tripleGroups != null && this.props.tripleGroups.length === 0 ? (
      <Alert severity="warning">No triples found, try adjusting the parameters!</Alert>
    ) : null;
  }

  renderTripleGroup(tripleGroup, index) {
    return (
      <TripleGroupDisplay
        tripleGroup={tripleGroup}
        key={"group" + index + 1}
        index={index}
        toggleZoomed={this.setZoomedGroupIndex.bind(this)}
        drawingRef={index === 0 ? this.drawing1Ref : null}
        width={this.state.drawing1Width}
        height={this.state.drawing1Height}
        mountCallback={this.setDimensions.bind(this)}
        canZoom={this.state.canZoom}
        desiredAngle={this.props.desiredAngle}
        showVertices={this.props.showVertices}
      />);
  }

  renderTripleGroups() {
    return (
      this.props.tripleGroups == null ? null :
      this.props.tripleGroups.length === 0 ?
      this.renderErrorMessage() :
      this.props.tripleGroups.map(this.renderTripleGroup.bind(this))
    );
  }

  isWideEnoughForZoom() {
    return window.innerWidth >= ZOOM_MINIMUM_WIDTH;
  }

  getDimensions(ref) {
    if (ref.current) {
      const boundingRect = ref.current.getBoundingClientRect();
      return boundingRect;
    } else {
      return {width: 0, height: 0}
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize);
    this.setDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  setDimensions() {
    const drawing1Dimensions = this.getDimensions(this.drawing1Ref);
    const zoomedDimensions = this.getDimensions(this.drawingZoomedRef);
    const canZoom = this.isWideEnoughForZoom();
    this.setState(
      {
        drawing1Width: drawing1Dimensions.width,
        drawing1Height: drawing1Dimensions.height,
        drawingZoomedWidth: zoomedDimensions.width,
        drawingZoomedHeight: zoomedDimensions.height,
        canZoom: canZoom,
        zoomedGroupIndex: canZoom ? this.state.zoomedGroupIndex : null
      }
    );
  }

  setZoomedGroupIndex(index) {
    console.log("Zooming to group " + index)
    this.setState({zoomedGroupIndex: index});
  }

  renderZoomedGroup() {
    if (!this.props.tripleGroups || this.state.zoomedGroupIndex == null) {
      return null;
    }
    console.log("Rendering zoomed group " + this.state.zoomedGroupIndex)
    return (
      <ZoomedTripleGroupDisplay
        tripleGroup={this.props.tripleGroups[this.state.zoomedGroupIndex]}
        index={this.state.zoomedGroupIndex}
        toggleZoomed={this.setZoomedGroupIndex.bind(this)}
        width={this.state.drawingZoomedWidth}
        height={this.state.drawingZoomedHeight}
        drawingRef={this.drawingZoomedRef}
        mountCallback={this.setDimensions.bind(this)}
        desiredAngle={this.props.desiredAngle}
        showVertices={this.props.showVertices}
     />);
  }

  render () {
    return (
      <div className="tripleGroups">
        <ArrowButton
          label="Previous"
          image={leftArrow}
          hoverImage={leftArrowHover}
          disabledImage={leftArrowDisabled}
          activeImage={leftArrowActive}
          className="previous"
          enabled={true}
        />
        <ArrowButton
          label="Next"
          image={rightArrow}
          hoverImage={rightArrowHover}
          disabledImage={rightArrowDisabled}
          activeImage={rightArrowActive}
          className="next"
          enabled={false}
        />
        {this.renderTripleGroups()}
        {this.renderZoomedGroup()}
      </div>
    )
  }
}

export default TripleViewer;