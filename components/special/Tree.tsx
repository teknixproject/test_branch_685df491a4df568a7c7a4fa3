/** @jsxImportSource @emotion/react */
import { Tree, TreeProps } from 'antd';
import React from 'react';

import RenderSliceItem from '../grid-systems/RenderSliceItem';

type Props = TreeProps;

const TreeSpecial: React.FC<Props> = ({ ...props }) => {
  const convertProps = () => {
    return {
      ...props,
      titleRender(node) {
        return <RenderSliceItem data={node?.title as any} valueStream={node} />;
      },
    } as TreeProps;
  };
  return <Tree {...convertProps()} />;
};

export default TreeSpecial;
