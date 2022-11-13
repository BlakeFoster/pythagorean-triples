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
    this.state = {tripleGroups: []}
  }

  setTripleGroups(tripleGroups) {
    this.setState({tripleGroups, tripleGroups});
  }

  renderTripleGroup(tripleGroup, index) {
    return (<TripleGroupDisplay tripleGroups={tripleGroup} key={"group" + index + 1} number={index + 1}/>);
  }

  render() {
    console.log("render"); 
    return (
      <div className="app">
        <h1>Pythagorean Triple Calculator</h1>
        <ThemeProvider theme={darkTheme}>
          <TripleCalculator setTripleGroups={this.setTripleGroups.bind(this)}/>
        </ThemeProvider>
        {this.state.tripleGroups.map(this.renderTripleGroup)}
      </div>
    );
  }
}

export default App;
