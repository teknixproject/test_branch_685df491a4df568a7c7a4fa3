'use client';
/** @jsxImportSource @emotion/react */
import { Upload, UploadFile } from 'antd';
import dayjs from 'dayjs';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { useRenderItem } from '@/hooks/useRenderItem';
import { getComponentType } from '@/utils/component';

import RenderFormArrayItem from './RenderFormArray';
import { ComponentRenderer, TProps } from './RenderSliceItem';

const RenderFormItem: FC<TProps> = (props) => {
  const { data, formKeys, valueStream, formKeysArray, index, parentPath = '' } = props;
  const methods = useFormContext();
  const { control } = methods;
  const { isLoading, valueType, Component, propsCpn } = useRenderItem({
    ...props,
    data,
    valueStream,
    methods,
  });
  const { name, ...rest } = propsCpn;

  const currentFormKeys = formKeysArray || formKeys;
  const inFormKeys = currentFormKeys?.find((item) => item?.value === data?.name);

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
            <Component
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
            </Component>
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
            <Component
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
            <Component
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
    <ComponentRenderer Component={Component} propsCpn={rest} data={data}>
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
    </ComponentRenderer>
  );
};
export default RenderFormItem;
