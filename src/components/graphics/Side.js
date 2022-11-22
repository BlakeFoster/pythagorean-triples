import React from "react";
import { Group } from "react-konva";


class Side extends React.Component {

  renderSegments() {
    var segments = new Array(this.props.length);

    const lOffset = this.props.lOffset
    const wOffset = this.props.wOffset

    for (var i=0; i<this.props.length; i+=1) {
      segments[this.props.length - i - 1] = (
        <this.props.displayElement
          x={lOffset + i * this.props.displayElement.getLength()}
          y={wOffset}
          key={i}
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