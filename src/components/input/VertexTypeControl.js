import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import InputGroup from "./InputGroup"
import { HINGE_PLATE, SINGLE_STUD } from "../../model/VertexConfig";

class HingeTypeControl extends React.Component {

  renderButton(vertexConfig) {
    return (
      <div className="vertexTypeButton">
        <FormControlLabel
          value={vertexConfig.name}
          control={<Radio />}
          label={vertexConfig.name}
          checked={this.props.vertexConfig === vertexConfig}
          onClick={() => {this.props.setVertexConfig(vertexConfig)}}
        />
      </div>
    );
  }

  render() {
    return (
      <InputGroup label="Vertex Type">
        <RadioGroup row>
          {this.renderButton(HINGE_PLATE)}
          {this.renderButton(SINGLE_STUD)}
        </RadioGroup>
      </InputGroup>
    )
  }
}

export default HingeTypeControl;