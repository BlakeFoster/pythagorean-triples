import React from "react";
import Switch from "@mui/material/Switch"
import Tooltip from "@mui/material/Tooltip"
import FormControlLabel from "@mui/material/FormControlLabel";
import InputGroup from "./InputGroup"
import { CORNER, CENTER } from "../../model/VertexConfig";

class VertexControl extends React.Component {

  renderButton(vertexLocation, checked, onClick) {
    return (
      <div className="vertexLocationButton">
        <FormControlLabel
          value={vertexLocation.name}
          control={<Switch/>}
          label={vertexLocation.name}
          checked={checked}
          onClick={onClick}
        />
      </div>
    );
  }

  render() {
    return (
      <InputGroup label="Vertex Location">
        {
          this.renderButton(
            CORNER,
            this.props.vertexConfig.enableCorner,
            () => this.props.setVertexConfig(this.props.vertexConfig.toggleCorner())
          )
        }
        {
          this.renderButton(
            CENTER,
            this.props.vertexConfig.enableCenter,
            () => this.props.setVertexConfig(this.props.vertexConfig.toggleCenter())
          )
        }
      </InputGroup>
    )
  }
}

export default VertexControl;