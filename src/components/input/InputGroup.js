import React from "react";

function InputGroup(props) {
  var innerContent = (
    <div className="fieldSetContent">
      {props.children}
    </div>
  );
  
  if (props.label) {
    innerContent = (
      <fieldset>
        <legend>{props.label}</legend>
        {innerContent}
      </fieldset>
    );
  }
  
  return (
    <div className="inputGroupRow">
      <div className="inputGroupCell">
        {innerContent}
      </div>
    </div>);
}

export default InputGroup;
