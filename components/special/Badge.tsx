import { BadgeProps, Badge as Component } from 'antd';
import React from 'react';

import { GridItem } from '@/types/gridItem';

import RenderSliceItem from '../grid-systems/RenderSliceItem';

type Props = BadgeProps & { data: GridItem };

const Badge: React.FC<Props> = ({ data, ...props }) => {
  return (
    <Component
      text={data?.childs?.map((child, index) => (
        <RenderSliceItem data={child} key={child.id ? String(child.id) : `child-${index}`} />
      ))}
      key={data?.id}
      {...props}
    />
  );
};

export default Badge;
