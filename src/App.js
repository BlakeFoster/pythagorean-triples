import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./App.css";
import TripleCalculator from "./components/input/TripleCalculator.js";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});


class App extends React.Component {

  render() {
    console.log("render"); 
    return (
      <div className="app">
        <ThemeProvider theme={darkTheme}>
          <TripleCalculator/>
        </ThemeProvider>
      </div>
    );
  }
}

export default App;
