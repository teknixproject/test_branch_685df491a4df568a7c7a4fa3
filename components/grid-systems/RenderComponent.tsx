'use client';
/** @jsxImportSource @emotion/react */
import _ from 'lodash';
import { FC, memo } from 'react';

import { GridItem } from '@/types/gridItem';

export type TProps = {
  data: GridItem;
  valueStream?: any;
  formKeys?: {
    key: string;
    value: string;
    isList: boolean;
    formKeys?: TProps['formKeys'];
  }[];
  formKeysArray?: TProps['formKeys'];
  index?: number;
  parentPath?: string;
};
const RenderComponent: FC<{
  Component: any;
  propsCpn: any;
  data: GridItem;
  children?: React.ReactNode;
}> = memo(({ Component, propsCpn, data, children }) => {
  const { style, ...newPropsCpn } = propsCpn;
  try {
    return (
      <Component
        key={data?.id}
        {...newPropsCpn}
        data={data}
        styleMultiple={data?.componentProps?.styleMultiple?.normal}
      >
        {!_.isEmpty(data?.childs) ? children : propsCpn.children}
      </Component>
    );
  } catch (error) {
    return <div {...newPropsCpn}>❌ Error rendering component</div>;
  }
});

RenderComponent.displayName = 'RenderComponent';
export default RenderComponent;
