'use client';
/** @jsxImportSource @emotion/react */
import _ from 'lodash';
import { FC } from 'react';

import { useRenderItem } from '@/hooks/useRenderItem';
import { GridItem } from '@/types/gridItem';
import { getComponentType } from '@/utils/component';

import RenderForm from './RenderForm';

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
export const ComponentRenderer: FC<{
  Component: any;
  propsCpn: any;
  data: GridItem;
  children?: React.ReactNode;
}> = ({ Component, propsCpn, data, children }) => {
  const { style, ...newPropsCpn } = propsCpn;
  try {
    return (
      <Component
        key={data?.id}
        {...newPropsCpn}
        styleMultiple={data?.componentProps?.styleMultiple?.normal}
      >
        {!_.isEmpty(data?.childs) ? children : propsCpn.children}
      </Component>
    );
  } catch (error) {
    return <div {...newPropsCpn}>❌ Error rendering component</div>;
  }
};

const RenderSliceItem: FC<TProps> = (props) => {
  const { data, valueStream } = props;

  const { isLoading, valueType, Component, propsCpn } = useRenderItem(props);

  const { isForm, isNoChildren, isChart, isMap, isBagde } = getComponentType(data?.value || '');

  if (!valueType) return <div></div>;

  if (isForm) return <RenderForm {...props} />;
  if (valueType === 'container' && propsCpn && 'mount' in propsCpn && !propsCpn.mount) {
    return null;
  }
  if (isNoChildren || isChart) return <Component key={data?.id} {...propsCpn} />;

  if (isBagde) {
    const isBadgeStatus = data.componentProps?.badgeStatus?.valueInput;
    if (isBadgeStatus)
      return (
        <Component
          text={data?.childs?.map((child, index) => (
            <RenderSliceItem
              {...props}
              data={child}
              key={child.id ? String(child.id) : `child-${index}`}
            />
          ))}
          key={data?.id}
          {...propsCpn}
        />
      );
  }
  return (
    <ComponentRenderer Component={Component} propsCpn={propsCpn} data={data}>
      {data?.childs?.map((child, index) => (
        <RenderSliceItem {...props} data={child} key={child.id ? String(child.id) : index} />
      ))}
    </ComponentRenderer>
  );
};

export default RenderSliceItem;
