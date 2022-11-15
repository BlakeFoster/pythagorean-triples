import React from "react";

import { Rect } from 'react-konva';


function BorderedRect(props) {
  const {x, y, width, height, strokeWidth, ...otherProps} = props;
  return (
    <Rect
      x={x + strokeWidth / 2}
      y={y + strokeWidth / 2}
      width={width - strokeWidth}
      height={height - strokeWidth}
      strokeWidth={strokeWidth}
      {...otherProps}
    />
  );
}

export default BorderedRect;