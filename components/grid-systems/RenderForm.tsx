'use client';
import { Form, Spin } from 'antd';
import _ from 'lodash';
/** @jsxImportSource @emotion/react */
import { FC, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDeepCompareEffect, useDeepCompareMemo } from 'use-deep-compare';

import { useActionsV2 } from '@/hooks/useActionsV2';
import { useRenderItem } from '@/hooks/useRenderItem';
import { getPropActions, prepareActions } from '@/utils';

import RenderFormItem from './RenderFormItem';
import { TProps } from './RenderSliceItem';

const RenderForm: FC<TProps> = (props) => {
  const { data } = props;
  const methods = useForm({});
  const [loading, setLoading] = useState<boolean>(false);
  // const formData = useWatch({
  //   control: methods.control,
  // });
  // console.log('🚀 ~ RenderForm ~ formData:', formData);
  //handle actions
  const { handleAction } = useActionsV2({ data, valueStream: props.valueStream, methods });

  const { propsCpn } = useRenderItem({
    ...props,
    methods,
  });

  useDeepCompareEffect(() => {
    if (!_.isEmpty(propsCpn?.values)) methods.reset(propsCpn?.values);
  }, [propsCpn?.values]);

  //prepare actions
  const events = useDeepCompareMemo(() => {
    return prepareActions({ data, handleAction, props, setLoading });
  }, [data, handleAction]);

  const { name, ...rest } = { ...propsCpn, ...events };

  const { handleSubmit } = methods;
  const formKeys = useMemo(() => data?.componentProps?.formKeys, [data?.componentProps?.formKeys]);

  //handle page load for actions
  useEffect(() => {
    const actionsProps = getPropActions(data);
    if ('onPageLoad' in actionsProps || {}) handleAction('onPageLoad');
  }, []);

  const onSubmit = () => {
    rest?.onFinish();
  };

  return (
    <Spin wrapperClassName="!w-full !h-full" rootClassName="!w-full !h-full" spinning={loading}>
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
