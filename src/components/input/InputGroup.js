import React from "react";


class InputGroup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isHovered: false}
  }

  invokeHoverCallback(isHovered) {
    this.setState({isHovered: isHovered})
    if (this.props.hoverCallback) {
      this.props.hoverCallback(isHovered);
    }
  }

  renderInnerContent() {
    var innerContent = (
      <div className="fieldSetContent">
        {this.props.children}
      </div>
    );
    if (this.props.label) {
      return (
        <fieldset>
          <legend>{this.props.label}</legend>
          {innerContent}
        </fieldset>
      );
    }
    return innerContent
  }

  render() {
    return (
      <div className={"inputGroupRow" + (this.state.isHovered ? " hover" : "")}>
        <div
          className="inputGroupCell"
          onMouseOver={this.invokeHoverCallback.bind(this, true)}
          onMouseOut={this.invokeHoverCallback.bind(this, false)}
        >
          {this.renderInnerContent()}
        </div>
      </div>
    );
  }
}

export default InputGroup;
