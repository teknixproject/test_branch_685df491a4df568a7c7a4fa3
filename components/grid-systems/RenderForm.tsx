import { FC, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useRenderItem } from '@/hooks/useRenderItem';

import LoadingPage from './loadingPage';
import RenderFormItem from './RenderFormItem';
import { ComponentRenderer, TProps } from './RenderSliceItem';

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
export default RenderForm;
