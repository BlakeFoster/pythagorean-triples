import React from "react";
import Alert from "@mui/material/Alert";

import TripleGroupDisplay from "./TripleGroupDisplay";
import ZoomedTripleGroupDisplay from "./ZoomedTripleGroupDisplay";
import { ZOOM_MINIMUM_WIDTH, TRIPLE_GROUPS_PER_PAGE_NORMAL, TRIPLE_GROUPS_PER_PAGE_SMALL } from "../../constants"
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
    return {
      image: props.enabled ? (
        state.image === props.disabledImage ?
        props.image : state.image
      ) : props.disabledImage
    }
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
        onClick={this.props.onClick}
        disabled={!this.props.enabled}
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
      tripleGroupIndex: 0
    }
    this.drawing1Ref = React.createRef();
    this.drawingZoomedRef = React.createRef();
    this.onResize = this.setDimensions.bind(this);
  }

  isErrorState() {
    console.log("triplegroups: " + this.props.tripleGroups)
    return this.props.tripleGroups && (this.props.tripleGroups.length === 0)
  }

  renderErrorMessage() {
    return this.isErrorState() ? (
      <Alert severity="warning">No triples found, try adjusting the parameters!</Alert>
    ) : null;
  }

  renderTripleGroup(tripleGroup, index) {
    return (
      <TripleGroupDisplay
        tripleGroup={tripleGroup}
        key={"group" + index + 1}
        index={index + this.props.tripleGroupIndex}
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

  getNumGroupsPerPage(canZoom = null) {
    return (
      canZoom == null ?
      this.state.canZoom : canZoom
    ) ? TRIPLE_GROUPS_PER_PAGE_NORMAL : TRIPLE_GROUPS_PER_PAGE_SMALL;
  }

  getTripleGroupsOnCurrentPage() {
    const start = this.props.tripleGroupIndex;
    const end = this.props.tripleGroupIndex + this.getNumGroupsPerPage();
    console.log("Showing triple groups " + (start + 1) + " through " + end + " of " + this.props.tripleGroups.length)
    return this.props.tripleGroups.slice(
      start, end
    )
  }

  renderTripleGroups() {
    return (
      this.props.tripleGroups == null ? null :
      this.props.tripleGroups.length === 0 ?
      this.renderErrorMessage() :
      this.getTripleGroupsOnCurrentPage().map(this.renderTripleGroup.bind(this))
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
    const numGroupsPerPage = this.getNumGroupsPerPage(canZoom);
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
    if (this.props.tripleGroupIndex % numGroupsPerPage) {
      this.props.setTripleGroupIndex(this.props.tripleGroupIndex - this.props.tripleGroupIndex % numGroupsPerPage);
    }
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

  nextPage() {
    this.props.setTripleGroupIndex(this.props.tripleGroupIndex + this.getNumGroupsPerPage());
  }

  prevPage() {
    Math.max(this.props.setTripleGroupIndex(this.props.tripleGroupIndex - this.getNumGroupsPerPage()), 0);
  }

  renderPageButtons() {
    return this.props.tripleGroups && !this.isErrorState() ? (
      <div className="pageButtons">
        <ArrowButton
          label="Previous"
          image={leftArrow}
          hoverImage={leftArrowHover}
          disabledImage={leftArrowDisabled}
          activeImage={leftArrowActive}
          className="previous"
          enabled={this.props.tripleGroupIndex > 0}
          onClick={this.prevPage.bind(this)}
        />
        <ArrowButton
          label="Next"
          image={rightArrow}
          hoverImage={rightArrowHover}
          disabledImage={rightArrowDisabled}
          activeImage={rightArrowActive}
          className="next"
          enabled={this.props.tripleGroupIndex + this.getNumGroupsPerPage() < this.props.tripleGroups.length}
          onClick={this.nextPage.bind(this)}
          tripleGroupIndex={this.props.tripleGroupIndex}
        />
      </div>
    ) : null;
  }

  render () {
    return (
      <div className="tripleGroups">
        {this.renderPageButtons()}
        {this.renderTripleGroups()}
        {this.renderZoomedGroup()}
      </div>
    )
  }
}

export default TripleViewer;