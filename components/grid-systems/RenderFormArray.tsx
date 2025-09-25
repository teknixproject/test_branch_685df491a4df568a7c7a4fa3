'use client';
/** @jsxImportSource @emotion/react */
import { List } from 'antd';
import { FC, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { useRenderItem } from '@/hooks/useRenderItem';

import RenderFormItem from './RenderFormItem';
import { TProps } from './RenderSliceItem';

const RenderFormArrayItem: FC<TProps> = (props) => {
  const { data, formKeys, valueStream, parentPath = '' } = props;
  const inFormKeys = formKeys?.find((item) => item?.value === data?.name);
  const methods = useFormContext();

  // The field name for this array
  const arrayFieldName = parentPath ? `${parentPath}.${inFormKeys?.key}` : inFormKeys?.key || '';

  const methodsArray = useFieldArray({
    control: methods.control,
    name: arrayFieldName,
  });

  const { isLoading, valueType, propsCpn } = useRenderItem({
    ...props,
    data,
    valueStream,
    methods,
    methodsArray,
  });

  const { name, ...rest } = useMemo(() => propsCpn, [propsCpn]);

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
          {/* {propsCpn?.box?.childs?.map((child: any) => (
            <RenderFormItem
              key={`${arrayFieldName}-${index}-${child.id}`}
              data={child}
              valueStream={item}
              formKeysArray={inFormKeys?.formKeys}
              index={index}
              parentPath={arrayFieldName}
              formKeys={formKeys}
            />
          ))} */}
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
