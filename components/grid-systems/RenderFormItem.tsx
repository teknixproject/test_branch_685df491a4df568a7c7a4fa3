'use client';
/** @jsxImportSource @emotion/react */
import { Checkbox, DatePicker, Switch, Upload, UploadFile } from 'antd';
import dayjs from 'dayjs';
import _ from 'lodash';
import { FC, useEffect, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useDeepCompareMemo } from 'use-deep-compare';

import { useActionsV2 } from '@/hooks/useActionsV2';
import { useRenderItem } from '@/hooks/useRenderItem';
import { getPropActions, prepareActions } from '@/utils';
import { getComponentType } from '@/utils/component';

import { componentRegistry } from './ListComponent';
import RenderComponent from './RenderComponent';
import RenderFormArrayItem from './RenderFormArray';
import { TProps } from './RenderSliceItem';

const RenderFormItem: FC<TProps> = (props) => {
  const { data, formKeys, valueStream, formKeysArray, index, parentPath = '' } = props;
  //hooks
  const methods = useFormContext();
  //handle actions
  const { handleAction } = useActionsV2({ data, valueStream: props.valueStream, methods });

  const { valueType, propsCpn } = useRenderItem({
    ...props,
    data,
    valueStream,
    methods,
  });
  //prepare actions
  const events = useDeepCompareMemo(() => {
    return prepareActions({ data, handleAction, props });
  }, [data, handleAction]);

  const { name, ...rest } = { ...propsCpn, ...events };
  const { control } = methods;
  const currentFormKeys = formKeysArray || formKeys;
  const inFormKeys = currentFormKeys?.find((item) => item?.value === data?.name);

  //registy a component
  const Component = useMemo(
    () => (valueType ? _.get(componentRegistry, valueType) || 'div' : 'div'),
    [valueType]
  );

  //handle page load for actions
  useEffect(() => {
    const actionsProps = getPropActions(data);
    if ('onPageLoad' in actionsProps || {}) handleAction('onPageLoad');
  }, []);

  const getFieldName = () => {
    if (!inFormKeys) return '';

    if (parentPath && typeof index === 'number') {
      return `${parentPath}.${index}.${inFormKeys.key}`;
    } else {
      return inFormKeys.key;
    }
  };

  const nameField = getFieldName();

  const { isInput } = getComponentType(data?.value || '');

  if (!valueType) return <div></div>;

  if (inFormKeys?.isList) {
    return (
      <RenderFormArrayItem
        {...props}
        data={data}
        formKeys={formKeys}
        valueStream={valueStream}
        parentPath={parentPath}
      />
    );
  }

  if (valueType === 'upload') {
    if (inFormKeys && nameField) {
      return (
        <Controller
          control={control}
          name={nameField}
          render={({ field }) => (
            <Upload
              {...rest}
              fileList={field.value?.map((base64: string, index: number) => ({
                uid: `-${index}`,
                name: `file-${index}`,
                status: 'done',
                url: base64,
              }))}
              onChange={async ({ fileList }: any) => {
                const base64Files = await Promise.all(
                  fileList.map(async (file: UploadFile) => {
                    if (file.originFileObj) {
                      return new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file.originFileObj as File);
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = () => resolve('');
                      });
                    }
                    return file.url || '';
                  })
                );
                field.onChange(base64Files.filter((base64) => base64 !== ''));
              }}
              beforeUpload={() => false}
            >
              {rest.children || <button>Upload</button>}
            </Upload>
          )}
        />
      );
    }
    return <Upload {...rest} />;
  }

  if (isInput && inFormKeys && nameField) {
    if (valueType === 'datepicker') {
      return (
        <Controller
          control={control}
          name={nameField}
          render={({ field }) => (
            <DatePicker
              {...rest}
              {...field}
              value={field.value ? dayjs(field.value) : null}
              onChange={(target: any) => {
                field.onChange(target);
                if (typeof rest?.onChange === 'function') {
                  rest.onChange(target);
                }
              }}
            />
          )}
        />
      );
    }

    if (valueType === 'checkbox') {
      return (
        <Controller
          control={control}
          name={nameField}
          render={({ field }) => (
            <Checkbox
              {...rest}
              {...field}
              checked={field.value}
              onChange={(e: any) => {
                field.onChange(e);
                if (typeof rest?.onChange === 'function') {
                  rest.onChange(e.target.checked);
                }
              }}
            />
          )}
        />
      );
    }
    if (valueType === 'switch') {
      return (
        <Controller
          control={control}
          name={nameField}
          render={({ field }) => (
            <Switch
              {...rest}
              {...field}
              checked={field.value}
              onChange={(e: any) => {
                field.onChange(e);
                if (typeof rest?.onChange === 'function') {
                  rest.onChange(e.target.checked);
                }
              }}
            />
          )}
        />
      );
    }
    return (
      <Controller
        control={control}
        name={nameField}
        render={({ field }) => (
          <Component
            {...rest}
            {...field}
            onChange={(target: any) => {
              field.onChange(target);
              if (typeof rest?.onChange === 'function') {
                rest.onChange(target);
              }
            }}
          />
        )}
      />
    );
  }

  if (isInput && !inFormKeys) {
    return <Component {...rest} />;
  }

  if (valueType === 'container' && propsCpn && 'mount' in propsCpn && !propsCpn.mount) {
    return null;
  }

  return (
    <RenderComponent Component={Component} propsCpn={rest} data={data}>
      {data?.childs?.map((child) => (
        <RenderFormItem
          {...props}
          data={child}
          key={`${child.id}`}
          parentPath={parentPath}
          index={index}
          formKeysArray={formKeysArray}
        />
      ))}
    </RenderComponent>
  );
};
export default RenderFormItem;
