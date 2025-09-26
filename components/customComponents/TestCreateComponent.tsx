
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import _ from "lodash";
import { CSSProperties } from "react";

interface TestCreateComponent4Props {
  data?: any;
  style?: CSSProperties;
}

const TestCreateComponent4 = ({ data, style }: TestCreateComponent4Props) => {
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

export default TestCreateComponent4;