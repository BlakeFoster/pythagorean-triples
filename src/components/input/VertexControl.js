import React from "react";
import Switch from "@mui/material/Switch"
import Tooltip from "@mui/material/Tooltip"
import FormControlLabel from "@mui/material/FormControlLabel";
import InputGroup from "./InputGroup"
import { CORNER, CENTER } from "../../model/VertexConfig";

class VertexControl extends React.Component {

  renderButton(vertexLocation, checked, onClick, tooltip) {
    return (
      <div className="vertexLocationButton">
        <Tooltip title={tooltip}>
          <FormControlLabel
            value={vertexLocation.name}
            control={<Switch/>}
            label={vertexLocation.name}
            checked={checked}
            onClick={onClick}
          />
        </Tooltip>
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
            () => this.props.setVertexConfig(this.props.vertexConfig.toggleCorner()),
            "Vertices will be at the corners of the sides. Best for constructing triangles with hinge plates."
          )
        }
        {
          this.renderButton(
            CENTER,
            this.props.vertexConfig.enableCenter,
            () => this.props.setVertexConfig(this.props.vertexConfig.toggleCenter()),
            "Vertices will be located in the center of the final stud on each side. Best for constructing triangles " +
            "with single stud connections as the hinges. Tip: in this configuration, all 3 sides extend 1.5 bricks " +
            "beyond the vertex on each end, which adds 1 stud to the length of each side. If you have a hard upper " +
            "limit on side length you may want to subtract 1 from each max to compensate."
          )
        }
      </InputGroup>
    )
  }
}

export default VertexControl;