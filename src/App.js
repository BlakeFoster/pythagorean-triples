import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./App.css";
import TripleCalculator from "./components/input/TripleCalculator";
import TripleViewer from "./components/output/TripleViewer"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tripleGroups: null,
      showSpinner: false,
      desiredAngle: null,
      showVertices: false
    }
  }

  setTripleGroups(tripleGroups, desiredAngle) {
    if (tripleGroups == null) {
      console.log("Triple groups cleared.")
    } else {
      console.log("Received triple groups")
    }
    this.setState(
      {
        tripleGroups: tripleGroups,
        desiredAngle: desiredAngle,
        showVertices: false,
        showSpinner: false,
        page: 0
      }
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.tripleGroups !== nextState.tripleGroups) {
      console.log("Triple groups changed");
      return true
    } else if (this.state.showSpinner !== nextState.showSpinner) {
      console.log("Spinner status changed");
      return true;
    } else if (this.state.showVertices !== nextState.showVertices) {
      console.log("Show vertices changes")
      return true;
    } else if (this.state.page !== nextState.page) {
      console.log("Page changed");
      return true;
    } else {
      return false;
    }
  }

  showSpinner() {
    console.log("Show spinner");
    this.setState(
      {
        showSpinner: true,
        tripleGroups: null
      }
    );
  }

  setShowVertices(showVertices) {
    console.log("Setting showVertices to " + showVertices)
    this.setState({showVertices: showVertices})
  }

  setPage(page) {
    console.log("Gping to page " + page);
    this.setState({page: page});
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
              hasTripleGroups={this.state.tripleGroups != null && this.state.tripleGroups.length > 0}
              showVertices={this.state.showVertices}
              setShowVertices={this.setShowVertices.bind(this)}
            />
            <TripleViewer
              tripleGroups={this.state.tripleGroups}
              desiredAngle={this.state.desiredAngle}
              showVertices={this.state.showVertices}
              page={this.state.page}
              setPage={this.setPage.bind(this)}
            />
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
