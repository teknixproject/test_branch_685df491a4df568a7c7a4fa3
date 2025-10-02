'use client';
/** @jsxImportSource @emotion/react */
import { List } from 'antd';
import { FC, useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useDeepCompareMemo } from 'use-deep-compare';

import { useActionsV2 } from '@/hooks/useActionsV2';
import { useRenderItem } from '@/hooks/useRenderItem';
import { getPropActions, prepareActions } from '@/utils';

import RenderFormItem from './RenderFormItem';
import { TProps } from './RenderSliceItem';

const RenderFormArrayItem: FC<TProps> = (props) => {
  const { data, formKeys, valueStream, parentPath = '' } = props;
  const inFormKeys = formKeys?.find((item) => item?.value === data?.name);
  // The field name for this array
  const arrayFieldName = parentPath ? `${parentPath}.${inFormKeys?.key}` : inFormKeys?.key || '';

  //#region hooks
  const methods = useFormContext();

  const methodsArray = useFieldArray({
    control: methods.control,
    name: arrayFieldName,
  });

  const { valueType, propsCpn } = useRenderItem({
    ...props,
    data,
    valueStream,
    methods,
    methodsArray,
  });

  //handle page load for actions
  useEffect(() => {
    const actionsProps = getPropActions(data);
    if ('onPageLoad' in actionsProps || {}) handleAction('onPageLoad');
  }, []);

  //handle actions
  const { handleAction } = useActionsV2({
    data,
    valueStream: props.valueStream,
    methods,
    methodsArray,
  });

  //prepare actions
  const events = useDeepCompareMemo(() => {
    return prepareActions({ data, handleAction, props });
  }, [data, handleAction]);

  const { name, ...rest } = { ...propsCpn, ...events };

  if (valueType === 'container' && propsCpn && 'mount' in propsCpn && !propsCpn.mount) {
    return null;
  }

  if (valueType !== 'list') return <div></div>;

  return (
    <List
      {...rest}
      dataSource={methodsArray.fields}
      renderItem={(item: any, index: number) => (
        <List.Item key={item.id}>
          <RenderFormItem
            key={`${arrayFieldName}-${index}-${propsCpn?.box.id}`}
            data={propsCpn?.box}
            valueStream={item}
            formKeysArray={inFormKeys?.formKeys}
            index={index}
            parentPath={arrayFieldName}
            formKeys={formKeys}
          />
        </List.Item>
      )}
    />
  );
};
export default RenderFormArrayItem;
