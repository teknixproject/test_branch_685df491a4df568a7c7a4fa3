import { Tabs as TabsAntd, TabsProps } from 'antd';
import React from 'react';

import RenderSliceItem from '../grid-systems/RenderSliceItem';

type Props = TabsProps;

const Tabs: React.FC<Props> = ({ ...props }) => {
  const data = props?.items?.map((item: any) => {
    return {
      ...item,
      children: <RenderSliceItem data={item.children} />,
    };
  });
  return <TabsAntd {...props} items={data} />;
};

export default Tabs;
