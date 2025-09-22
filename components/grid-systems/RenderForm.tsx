'use client';
import { Form, Spin } from 'antd';
import _ from 'lodash';
/** @jsxImportSource @emotion/react */
import { FC, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDeepCompareEffect } from 'use-deep-compare';

import { useRenderItem } from '@/hooks/useRenderItem';

import RenderFormItem from './RenderFormItem';
import { TProps } from './RenderSliceItem';

const RenderForm: FC<TProps> = (props) => {
  const { data } = props;
  const methods = useForm({});
  const { isLoading, valueType, Component, propsCpn, dataState } = useRenderItem({
    ...props,
    methods,
  });

  useDeepCompareEffect(() => {
    if (!_.isEmpty(propsCpn?.values)) methods.reset(propsCpn?.values);
  }, [propsCpn?.values]);

  const { name, ...rest } = propsCpn;

  const { handleSubmit } = methods;
  const formKeys = useMemo(() => data?.componentProps?.formKeys, [data?.componentProps?.formKeys]);

  const onSubmit = () => {
    rest?.onFinish();
  };

  return (
    <Spin spinning={isLoading} wrapperClassName="!w-full !h-full">
      <FormProvider {...methods}>
        <Form {...rest} onFinish={() => handleSubmit(onSubmit)()}>
          {data?.childs?.map((child, index) => (
            <RenderFormItem
              {...props}
              data={child}
              key={`form-child-${child.id}`}
              formKeys={formKeys}
            />
          ))}
        </Form>
      </FormProvider>
    </Spin>
  );
};
export default RenderForm;
