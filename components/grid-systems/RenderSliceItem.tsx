/* eslint-disable @typescript-eslint/no-unused-vars */
import { List, Upload, UploadFile } from 'antd';
import dayjs from 'dayjs';
/** @jsxImportSource @emotion/react */
import _ from 'lodash';
import { FC, useMemo } from 'react';
import {
  Controller,
  FieldValues,
  FormProvider,
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form';
import { useDeepCompareMemo } from 'use-deep-compare';

import { useActions } from '@/hooks/useActions';
import { useHandleData } from '@/hooks/useHandleData';
import { useHandleProps } from '@/hooks/useHandleProps';
import { stateManagementStore } from '@/stores';
import { GridItem } from '@/types/gridItem';
import { getComponentType } from '@/uitls/component';
import { cleanProps } from '@/uitls/renderItem';
import { convertCssObjectToCamelCase, convertToEmotionStyle } from '@/uitls/styleInline';
import { convertToPlainProps } from '@/uitls/transfromProp';
import { css } from '@emotion/react';

import { componentRegistry, convertProps } from './ListComponent';
import LoadingPage from './loadingPage';

type TProps = {
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
const getPropData = (data: GridItem) =>
  data?.componentProps?.dataProps?.filter((item: any) => item.type === 'data');

const getPropActions = (data: GridItem) =>
  data?.componentProps?.dataProps?.filter((item: any) => item.type.includes('MouseEventHandler'));
const handleCssWithEmotion = (staticProps: Record<string, any>) => {
  const advancedCss = convertToEmotionStyle(staticProps?.styleMultiple);
  let cssMultiple;

  if (typeof advancedCss === 'string') {
    cssMultiple = css`
      ${advancedCss}
    `;
  } else if (advancedCss && typeof advancedCss === 'object') {
    const convertedCssObj = convertCssObjectToCamelCase(advancedCss);
    cssMultiple = css(convertedCssObj);
  } else {
    cssMultiple = css``;
  }

  return cssMultiple;
};
const useRenderItem = ({
  data,
  valueStream,
  methods,
  methodsArray,
}: {
  data: GridItem;
  valueStream?: any;
  methods?: UseFormReturn<FieldValues, any, FieldValues>;
  methodsArray?: UseFieldArrayReturn<FieldValues, string, 'id'>;
}) => {
  const valueType = useMemo(() => data?.value?.toLowerCase() || '', [data?.value]);
  const { isNoChildren } = getComponentType(data?.value || '');
  const { isLoading } = useActions({ data, valueStream, methods: methods, methodsArray });
  const findVariable = stateManagementStore((state) => state.findVariable);
  const { dataState } = useHandleData({
    dataProp: getPropData(data),
    componentProps: data?.componentProps,
    valueStream,
    valueType,
    activeData: data,
  });

  const {
    actions,
    isLoading: isLoadingAction,
    loading,
  } = useHandleProps({
    dataProps: getPropActions(data),
    data,
    valueStream,
    methods,
    methodsArray,
  });

  const Component = useMemo(
    () => (valueType ? _.get(componentRegistry, valueType) || 'div' : 'div'),
    [valueType]
  );

  const propsCpn = useDeepCompareMemo(() => {
    const staticProps: Record<string, any> = {
      ...convertProps({ initialProps: dataState, valueType }),
    };

    staticProps.css = handleCssWithEmotion(staticProps);

    let result =
      valueType === 'menu'
        ? { ...staticProps, ...actions }
        : {
          ...dataState,
          ...staticProps,
          ...actions,
        };

    if (isNoChildren && 'children' in result) {
      _.unset(result, 'children');
    }
    if ('styleMultiple' in result) _.unset(result, 'styleMultiple');
    if ('dataProps' in result) _.unset(result, 'dataProps');
    const plainProps = convertToPlainProps(result);

    result = cleanProps(plainProps, valueType);
    console.log(`🚀 ~ useRenderItem ~ result: ${data.id}`, result);

    return result;
  }, [actions, dataState, isNoChildren, valueType]);

  return {
    isLoading: isLoading || isLoadingAction,
    valueType,
    Component,
    propsCpn: {
      ...propsCpn,
      loading: isLoading || isLoadingAction,
    },
    findVariable,
    dataState,
  };
};

// Generic component renderer
const ComponentRenderer: FC<{
  Component: any;
  propsCpn: any;
  data: GridItem;
  children?: React.ReactNode;
}> = ({ Component, propsCpn, data, children }) => {
  const { style, ...newPropsCpn } = propsCpn;
  try {
    return (
      <Component key={data?.id} {...newPropsCpn}>
        {!_.isEmpty(data?.childs) ? children : propsCpn.children}
      </Component>
    );
  } catch (error) {
    return <div {...newPropsCpn}>❌ Error rendering component</div>;
  }
};

const RenderSliceItem: FC<TProps> = (props) => {
  const { data, valueStream } = useMemo(() => props, [props]);

  const { isLoading, valueType, Component, propsCpn } = useRenderItem({ data, valueStream });

  const { isForm, isNoChildren, isChart, isMap, isBagde } = getComponentType(data?.value || '');
  if (!valueType) return <div></div>;
  // if (isLoading) return <LoadingPage />;
  if (isForm) return <RenderForm {...props} />;
  if (valueType === 'container' && propsCpn && 'mount' in propsCpn && !propsCpn.mount) {
    return null;
  }
  if (isNoChildren || isChart) return <Component key={data?.id} {...propsCpn} />;
  if (isMap)
    return (
      <div style={{ width: propsCpn.width || '100%', height: propsCpn.height || '400px' }}>
        <Component key={data?.id} {...propsCpn} />
      </div>
    );
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
        <RenderSliceItem
          {...props}
          data={child}
          key={child.id ? String(child.id) : `child-${index}`}
        />
      ))}
    </ComponentRenderer>
  );
};

const RenderForm: FC<TProps> = (props) => {
  const { data, valueStream } = props;
  const methods = useForm({});
  const { isLoading, valueType, Component, propsCpn, dataState } = useRenderItem({
    data,
    valueStream,
    methods,
  });

  const { name, ...rest } = useMemo(() => propsCpn, [propsCpn]);

  const { handleSubmit } = methods;
  const formKeys = useMemo(() => data?.componentProps?.formKeys, [data?.componentProps?.formKeys]);

  const onSubmit = (formData: any) => {
    rest?.onFinish();
  };

  if (!valueType) return <div></div>;
  // if (isLoading) return <LoadingPage></LoadingPage>;

  return (
    <FormProvider {...methods}>
      <ComponentRenderer
        Component={Component}
        propsCpn={{
          ...rest,
          onFinish: () => handleSubmit(onSubmit)(),
        }}
        data={data}
      >
        {data?.childs?.map((child, index) => (
          <RenderFormItem
            {...props}
            data={child}
            key={`form-child-${child.id}`}
            formKeys={formKeys}
          />
        ))}
      </ComponentRenderer>
    </FormProvider>
  );
};

const RenderFormItem: FC<TProps> = (props) => {
  const { data, formKeys, valueStream, formKeysArray, index, parentPath = '' } = props;
  const methods = useFormContext();
  const { control } = methods;
  const { isLoading, valueType, Component, propsCpn } = useRenderItem({
    data,
    valueStream,
    methods,
  });
  const { name, ...rest } = useMemo(() => propsCpn, [propsCpn]);

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
              key={`form-child-${data?.id}`}
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
            key={`form-child-${data?.id}`}
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

  // if (isLoading) return <LoadingPage />;

  return (
    <ComponentRenderer Component={Component} propsCpn={rest} data={data}>
      {data?.childs?.map((child) => (
        <RenderFormItem
          {...props}
          data={child}
          key={`form-child-${child.id}`}
          parentPath={parentPath}
          index={index}
          formKeysArray={formKeysArray}
        />
      ))}
    </ComponentRenderer>
  );
};

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

  const { isLoading, valueType, Component, propsCpn } = useRenderItem({
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
  // if (isLoading) return <LoadingPage />;

  return (
    <List
      {...rest}
      dataSource={methodsArray.fields}
      renderItem={(item: any, index: number) => (
        <List.Item key={item.id}>
          {propsCpn?.box?.childs?.map((child: any) => (
            <RenderFormItem
              key={`${arrayFieldName}-${index}-${child.id}`}
              data={child}
              valueStream={item}
              formKeysArray={inFormKeys?.formKeys}
              index={index}
              parentPath={arrayFieldName}
              formKeys={formKeys}
            />
          ))}
        </List.Item>
      )}
    />
  );
};

export default RenderSliceItem;
