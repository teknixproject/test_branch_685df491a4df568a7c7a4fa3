
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import _ from "lodash";
import { CSSProperties } from "react";

interface YourNameComponentProps {
  data?: any;
  style?: CSSProperties;
}

const YourNameComponent = ({ data, style }: YourNameComponentProps) => {
  const title = _.get(data, "title", "Title Header");

  const newStyle: CSSProperties = {
    ...style,
  };

  return (
    <div
      style={newStyle}
      className="text-[#858585]"
    >
      {title}
    </div>
  );
};

export default YourNameComponent;