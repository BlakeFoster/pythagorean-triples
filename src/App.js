import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";
import TripleCalculator from "./components/input/TripleCalculator";
import TripleGroupDisplay from "./components/output/TripleGroupDisplay";
import ZoomedTripleGroupDisplay from "./components/output/ZoomedTripleGroupDisplay";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tripleGroups: [],
      zoomedGroupIndex: null
    }
  }

  setTripleGroups(tripleGroups) {
    this.setState(
      {
        tripleGroups: tripleGroups,
        zoomedGroupIndex: null
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
     />);
  }

  render() {
    return (
      <div className="app">
        <h1 id="title">Pythagorean Triple Calculator</h1>
        <ThemeProvider theme={darkTheme}>
          <TripleCalculator setTripleGroups={this.setTripleGroups.bind(this)}/>
          {this.state.tripleGroups.map(this.renderTripleGroup.bind(this))}
          {this.renderZoomedGroup()}
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
