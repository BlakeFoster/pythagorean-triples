import React from "react";
import { Group } from "react-konva";


class Side extends React.Component {

  renderSegments() {
    var segments = new Array(this.props.length);

    for (var i=0; i<this.props.length; i+=1) {
      segments[this.props.length - i - 1] = (
        <this.props.displayElement
          x={i * this.props.displayElement.getLength()}
          y={0}
          key={i}
        />
      );
    }
    return segments;
  }

  render() {
    console.log("Side with length " + this.props.length + " side at (" + this.props.x + ", " + this.props.y + ") " + this.props.angle)
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