import React from "react";
import { Group } from "react-konva";

import { STUDS, PLATES } from "../../model/Unit"

class Side extends React.Component {

  renderSegments() {
    var segments = new Array(this.props.length);

    for (var i=0; i<this.props.length; i+=1) {

      segments[this.props.length - i - 1] = (
        <this.props.displayElement
          x={i * this.props.displayElement.LENGTH}
          y={0}
        />
      );
    }
    return segments;
  }

  render() {
    return (
      <Group
        rotation={this.props.angle}
        x={this.props.x}
        y={this.props.y}
      >
        {this.renderSegments()}
      </Group>
    )
  }
}

export default Side;