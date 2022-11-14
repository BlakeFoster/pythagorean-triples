import React from "react";
import TextField from "@mui/material/TextField";

class NumericTextField extends React.Component {
  setValue(event) {
    const value = event.target.value.trim();
    var newValue = this.props.value;
    if (value.length === 0) {
      newValue = null;
    } else if (/^[0-9]*$/.test(value)) {
       const numericValue = parseInt(value);
       if (numericValue != 0) {
         newValue = numericValue;
       }
    }
    this.props.onChange(newValue);
  }

  render() {
    return (
      <TextField
        onChange={this.setValue.bind(this)}
        onBlur={this.props.onBlur}
        value={this.props.value == null ? "" : this.props.value}
        label={this.props.label}
        variant="standard"
      />);
  }
}

export default NumericTextField;