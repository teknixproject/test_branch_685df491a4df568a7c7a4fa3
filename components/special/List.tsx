/** @jsxImportSource @emotion/react */
import { List as ListAntd, ListProps } from 'antd';
import React from 'react';

import { GridItem } from '@/types/gridItem';

import RenderSliceItem from '../grid-systems/RenderSliceItem';

type Props = ListProps<any> & {
  box: GridItem;
};

const List: React.FC<Props> = ({ ...props }) => {
  return (
    <ListAntd
      {...props}
      renderItem={(item: any, index: number) => {
        return (
          <ListAntd.Item>
            <RenderSliceItem data={props.box} valueStream={item} index={index} />
          </ListAntd.Item>
        );
      }}
    />
  );
};

export default List;
