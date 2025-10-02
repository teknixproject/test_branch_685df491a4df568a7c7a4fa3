'use client';
/** @jsxImportSource @emotion/react */
import _ from 'lodash';
import { FC, useMemo, useState } from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';

import { useActionsV2 } from '@/hooks/useActionsV2';
import { useRenderItem } from '@/hooks/useRenderItem';
import { GridItem } from '@/types/gridItem';
import { getPropActions, prepareActions } from '@/utils';
import { getComponentType } from '@/utils/component';
import { useQuery } from '@tanstack/react-query';

import { componentRegistry } from './ListComponent';
import RenderComponent from './RenderComponent';
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

const RenderSliceItem: FC<TProps> = (props) => {
  const { data } = props;
  const { isForm, isNoChildren } = getComponentType(data?.value || '');
  const [loading, setLoading] = useState<boolean>(false);
  const valueType = useMemo(() => data?.value?.toLowerCase() || '', [data?.value]);
  //registy a component
  const Component = useMemo(
    () => (valueType ? _.get(componentRegistry, valueType) || 'div' : 'div'),
    [valueType]
  );

  const checkOnPageLoad = useDeepCompareMemo(() => {
    const actionsProps = getPropActions(data);
    return 'onPageLoad' in actionsProps;
  }, [data]);
  //handle hooks
  const { propsCpn: propsCpnHook } = useRenderItem(props);

  //handle actions
  const { handleAction } = useActionsV2({ data, valueStream: props.valueStream });
  //handle page load for actions
  const { isLoading } = useQuery({
    queryKey: ['onPageLoad', data?.id],
    queryFn: () => handleAction('onPageLoad', undefined),
    enabled: checkOnPageLoad,
  });

  //prepare actions
  const events = useDeepCompareMemo(() => {
    return prepareActions({ data, handleAction, props, setLoading });
  }, [data, handleAction]);

  const propsCpn = {
    ...propsCpnHook,
    ...events,
    ...(['list', 'table'].includes(valueType) && { loading: isLoading }),
  };

  //#region render
  if (!valueType) return <div></div>;

  if (isForm) return <RenderForm {...props} />;

  if (valueType === 'container' && propsCpn && 'mount' in propsCpn && !propsCpn.mount) {
    return null;
  }

  if (isNoChildren) return <Component key={data?.id} {...propsCpn} />;

  // if (isBagde) {
  //   const isBadgeStatus = data.componentProps?.badgeStatus?.valueInput;
  //   if (isBadgeStatus)
  //     return (
  //       <Component
  //         text={data?.childs?.map((child, index) => (
  //           <RenderSliceItem
  //             {...props}
  //             data={child}
  //             key={child.id ? String(child.id) : `child-${index}`}
  //           />
  //         ))}
  //         key={data?.id}
  //         {...propsCpn}
  //       />
  //     );
  // }

  return (
    <RenderComponent Component={Component} propsCpn={propsCpn} data={data}>
      {data?.childs?.map((child, index) => (
        <RenderSliceItem {...props} data={child} key={child.id ? String(child.id) : index} />
      ))}
    </RenderComponent>
  );
};

export default RenderSliceItem;
