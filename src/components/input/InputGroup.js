import React from "react";


class InputGroup extends React.Component {

  invokeHoverCallback(isHovered) {
    if (this.props.hoverCallback) {
      this.props.hoverCallback(isHovered);
    }
  }

  render() {
    var innerContent = (
      <div className="fieldSetContent">
        {this.props.children}
      </div>
    );

    if (this.props.label) {
      innerContent = (
        <fieldset>
          <legend>{this.props.label}</legend>
          {innerContent}
        </fieldset>
      );
    }

    return (
      <div className="inputGroupRow">
        <div
          className="inputGroupCell"
          onMouseOver={this.invokeHoverCallback.bind(this, true)}
          onMouseOut={this.invokeHoverCallback.bind(this, false)}
        >
          {innerContent}
        </div>
      </div>
    );
  }
}

export default InputGroup;
