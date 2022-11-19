import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./App.css";
import TripleCalculator from "./components/input/TripleCalculator";
import TripleGroupDisplay from "./components/output/TripleGroupDisplay";
import ZoomedTripleGroupDisplay from "./components/output/ZoomedTripleGroupDisplay";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const ZOOM_MINIMUM_WIDTH = 600;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tripleGroups: [],
      errorMessage: null,
      zoomedGroupIndex: null,
      drawing1Width: 0,
      drawing1Height: 0,
      drawingZoomedWidth: 0,
      drawingZoomedHeight: 0,
      canZoom: this.isWideEnoughForZoom(),
      showSpinner: false
    }
    this.drawing1Ref = React.createRef();
    this.drawingZoomedRef = React.createRef();
    this.onResize = this.setDimensions.bind(this);
  }

  setTripleGroups(tripleGroups) {
    console.log("Received triple groups")
    this.setState(
      {
        tripleGroups: tripleGroups,
        zoomedGroupIndex: null,
        errorMessage: tripleGroups.length ? null : "No triples found, try adjusting the parameters!",
        showSpinner: false
      }
    );
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
      />);
  }

  setZoomedGroupIndex(index) {
    console.log("Zooming to group " + index)
    this.setState({zoomedGroupIndex: index});
  }

  renderZoomedGroup() {
    if (this.state.zoomedGroupIndex == null) {
      return null;
    }
    console.log("Rendering zoomed group " + this.state.zoomedGroupIndex)
    return (
      <ZoomedTripleGroupDisplay
        tripleGroup={this.state.tripleGroups[this.state.zoomedGroupIndex]}
        index={this.state.zoomedGroupIndex}
        toggleZoomed={this.setZoomedGroupIndex.bind(this)}
        width={this.state.drawingZoomedWidth}
        height={this.state.drawingZoomedHeight}
        drawingRef={this.drawingZoomedRef}
        mountCallback={this.setDimensions.bind(this)}
     />);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.tripleGroups !== nextState.tripleGroups) {
      console.log("Triple groups changed");
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
    } else if (this.state.errorMessage !== nextState.errorMessage) {
      console.log("Error message changed");
      return true;
    } else if (this.state.showSpinner !== nextState.showSpinner) {
      console.log("Spinner status changed");
      return true;
    } else {
      return false;
    }
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

  componentDidMount() {
    window.addEventListener("resize", this.onResize);
    this.setDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  renderErrorMessage() {
    return this.state.errorMessage ? (<Alert severity="warning">{this.state.errorMessage}</Alert>) : null;
  }

  showSpinner() {
    console.log("Show spinner");
    this.setState(
      {
        showSpinner: true,
        errorMessage: null
      }
    );
  }

  render() {
    console.log("Rendering app.")
    return (
      <div className="app">
        <div className="content">
          <h1 id="title">Lego Right Triangle Calculator</h1>
          <ThemeProvider theme={darkTheme}>
            <TripleCalculator
              setTripleGroups={this.setTripleGroups.bind(this)}
              calculatingCallback={this.showSpinner.bind(this)}
            />
            <div className="tripleGroups">
              {this.state.tripleGroups.map(this.renderTripleGroup.bind(this))}
              {this.renderErrorMessage()}
              {this.renderZoomedGroup()}
            </div>
            <Backdrop open={this.state.showSpinner}>
              <CircularProgress/>
            </Backdrop>
          </ThemeProvider>
        </div>
      </div>
    );
  }
}

export default App;
