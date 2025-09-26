
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import _ from "lodash";
import { CSSProperties } from "react";

interface PreviewOneProps {
  data?: any;
  style?: CSSProperties;
}

const PreviewOne = ({ data, style }: PreviewOneProps) => {
  const title = _.get(data, "title", "Title Header");

  const newStyle: CSSProperties = {
    ...style,
  };

  return (
    <div
      style={newStyle}
      className="text-[#858585]"
    >
      1234
      {title}
    </div>
  );
};

export default PreviewOne;