
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import _ from "lodash";
import { CSSProperties } from "react";

interface PreviewTwoProps {
  data?: any;
  style?: CSSProperties;
}

const PreviewTwo = ({ data, style }: PreviewTwoProps) => {
  const title = _.get(data, "title", "Title Header");

  const newStyle: CSSProperties = {
    ...style,
  };

  return (
    <div
      style={newStyle}
      className="text-[#858585]"
    >
      345
      {title}
    </div>
  );
};

export default PreviewTwo;