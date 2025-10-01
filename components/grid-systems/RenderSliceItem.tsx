'use client';
/** @jsxImportSource @emotion/react */
import _ from 'lodash';
import { FC, useEffect, useMemo } from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';

import { useActionsV2 } from '@/hooks/useActionsV2';
import { useRenderItem } from '@/hooks/useRenderItem';
import { GridItem } from '@/types/gridItem';
import { getPropActions } from '@/utils';
import { getComponentType } from '@/utils/component';

import { componentRegistry } from './ListComponent';
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
  const { data } = props;
  const valueType = useMemo(() => data?.value?.toLowerCase() || '', [data?.value]);

  const Component = useMemo(
    () => (valueType ? _.get(componentRegistry, valueType) || 'div' : 'div'),
    [valueType]
  );
  const { propsCpn: propsCpnHook } = useRenderItem(props);

  const { handleAction } = useActionsV2({ ...props });

  const events = useDeepCompareMemo(() => {
    const actions = getPropActions(data);
    const validActions = _.pickBy(
      actions,
      (value) => value?.data && Object.keys(value.data).length > 0
    );

    return Object.fromEntries(
      Object.entries(validActions).map(([key, value]) => [
        key,
        async (...callbackArgs: any[]) => {
          try {
            // Optional: setLoading(key, true); debounce nếu cần
            await handleAction(key, undefined, {
              callbackArgs,
              valueStream: props.valueStream,
            });
          } catch (error) {
            console.error(`Error in action ${key}:`, error);
            // setLoading(key, false);
          }
        },
      ])
    );
  }, [data, handleAction]); // Thêm handleAction vào deps nếu nó stable

  const propsCpn = { ...propsCpnHook, ...events };

  useEffect(() => {
    const actionsProps = getPropActions(data);
    if ('onPageLoad' in actionsProps || {}) handleAction('onPageLoad');
  }, []);

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
