/* eslint-disable @typescript-eslint/no-unused-vars */
import { Upload, UploadFile } from 'antd';
/** @jsxImportSource @emotion/react */
import _ from 'lodash';
import { FC, useMemo } from 'react';
import {
    Controller, FieldValues, FormProvider, useForm, useFormContext, UseFormReturn
} from 'react-hook-form';

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

function extractVariableIdsWithLodash(obj: any): string[] {
  const variableIds: string[] = [];

  function collectVariableIds(value: any, key: string) {
    if (key === 'variableId' && typeof value === 'string') {
      variableIds.push(value);
    }
  }

  function deepIterate(obj: any) {
    _.forOwn(obj, (value, key) => {
      collectVariableIds(value, key);

      if (_.isObject(value)) {
        deepIterate(value);
      }
    });

    if (_.isArray(obj)) {
      obj.forEach((item) => {
        if (_.isObject(item)) {
          deepIterate(item);
        }
      });
    }
  }

  deepIterate(obj);

  return _.uniq(variableIds);
}
type TProps = {
  data: GridItem;
  valueStream?: any;
  formKeys?: { key: string; value: string }[];
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
}: {
  data: GridItem;
  valueStream?: any;
  methods?: UseFormReturn<FieldValues, any, FieldValues>;
}) => {
  const valueType = useMemo(() => data?.value?.toLowerCase() || '', [data?.value]);
  const { isNoChildren } = getComponentType(data?.value || '');
  const { isLoading } = useActions({ data, valueStream, methods: methods });
  const findVariable = stateManagementStore((state) => state.findVariable);
  const { dataState } = useHandleData({
    dataProp: getPropData(data),
    componentProps: data?.componentProps,
    valueStream,
    valueType,
    activeData: data,
  });
  // console.log(`🚀 ~ useRenderItem ~ dataState: ${data.id}`, dataState);

  const { actions } = useHandleProps({
    dataProps: getPropActions(data),
    data,
    valueStream,
    methods,
  });

  const Component = useMemo(
    () => (valueType ? _.get(componentRegistry, valueType) || 'div' : 'div'),
    [valueType]
  );

  const propsCpn = useMemo(() => {
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

    return result;
  }, [actions, dataState, isNoChildren, valueType]);

  return {
    isLoading: isLoading,
    valueType,
    Component,
    propsCpn: {
      ...propsCpn,
      loading: isLoading,
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

  return (
    <Component key={data?.id} {...newPropsCpn}>
      {!_.isEmpty(data?.childs) ? children : propsCpn.children}
    </Component>
  );
};

const RenderSliceItem: FC<TProps> = (props) => {
  const { data, valueStream } = useMemo(() => props, [props]);

  const { isLoading, valueType, Component, propsCpn } = useRenderItem({ data, valueStream });

  const { isForm, isNoChildren, isChart, isMap, isBagde } = getComponentType(data?.value || '');
  if (!valueType) return <div></div>;
  if (isLoading) return <LoadingPage />;
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
  if (isLoading) return <LoadingPage></LoadingPage>;

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
  const { data, formKeys, valueStream } = props;
  const methods = useFormContext();
  const { control } = methods;
  const { isLoading, valueType, Component, propsCpn } = useRenderItem({
    data,
    valueStream,
    methods,
  });
  const { name, ...rest } = useMemo(() => propsCpn, [propsCpn]);

  const { isInput } = getComponentType(data?.value || '');

  if (!valueType) return <div></div>;

  if (valueType === 'upload') {
    const inFormKeys = formKeys?.find((item) => item?.value === data?.name);

    if (inFormKeys) {
      return (
        <Controller
          control={control}
          name={inFormKeys.key}
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
                // Chuyển đổi file thành Base64
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
                // Lưu mảng chuỗi Base64 vào form
                field.onChange(base64Files.filter((base64) => base64 !== ''));
              }}
              beforeUpload={() => false} // Ngăn upload lên server
            >
              {rest.children || <button>Upload</button>}
            </Component>
          )}
        />
      );
    }
    return <Upload {...rest} />;
  }

  if (isInput) {
    const inFormKeys = formKeys?.find((item) => item?.value === data?.name);

    if (inFormKeys) {
      return (
        <Controller
          control={control}
          name={inFormKeys.key}
          render={({ field }) => {
            return (
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
            );
          }}
        />
      );
    }
    return <Component {...rest} />;
  }
  if (!valueType) return <div></div>;
  if (isLoading) return <LoadingPage />;
  return (
    <ComponentRenderer Component={Component} propsCpn={rest} data={data}>
      {data?.childs?.map((child) => (
        <RenderFormItem {...props} data={child} key={`form-child-${child.id}`} />
      ))}
    </ComponentRenderer>
  );
};

export default RenderSliceItem;
