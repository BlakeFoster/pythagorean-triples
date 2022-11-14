import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";
import TripleCalculator from "./components/input/TripleCalculator";
import TripleGroupDisplay from "./components/output/TripleGroupDisplay";

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
        tripleGroups, tripleGroups,
        zoomedGroupIndex: null
      }
    );
  }

  renderTripleGroup(zoomed, tripleGroup, index) {
    return (
      <TripleGroupDisplay
        tripleGroups={tripleGroup}
        key={"group" + index + 1}
        number={index + 1}
        zoomed={zoomed}
        toggleZoomed={this.setZoomedGroupIndex.bind(this, zoomed ? null : index)}
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
    return this.renderTripleGroup(
      true,
      this.state.tripleGroups[this.state.zoomedGroupIndex],
      this.state.zoomedGroupIndex
    )
  }

  render() {
    console.log("render"); 
    return (
      <div className="app">
        <h1 id="title">Pythagorean Triple Calculator</h1>
        <ThemeProvider theme={darkTheme}>
          <TripleCalculator setTripleGroups={this.setTripleGroups.bind(this)}/>
          {this.state.tripleGroups.map(this.renderTripleGroup.bind(this, false))}
          {this.renderZoomedGroup()}
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
