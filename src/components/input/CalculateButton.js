import React from "react";
import Button from "@mui/material/Button";
import InputGroup from "./InputGroup";


class CalculateButton extends React.Component {

  getHelpMessage() {
    return this.props.enabled ? (<>&nbsp;</>) : (<>Choose at least 2 side lengths and the desired angle.</>);
  }

  render() {
    return (
      <InputGroup>
        <div className="inputGroupContent">
          <Button
            variant="contained"
            color="warning"
            disabled={!this.props.enabled}
            onClick={this.props.onClick}
          >Calculate</Button>
          <div className="helpMessage">{this.getHelpMessage()}</div>
        </div>
      </InputGroup>
    );
  }
}

export default CalculateButton;