/** @jsxImportSource @emotion/react */
import _ from 'lodash';
import { useMemo } from 'react';
import { FieldValues, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { useDeepCompareMemo } from 'use-deep-compare';

import { useHandleData } from '@/hooks/useHandleData';
import { GridItem } from '@/types/gridItem';
import { getComponentType } from '@/utils/component';
import { getPropData } from '@/utils/getDataField';
import { cleanProps } from '@/utils/renderItem';
import { buildStyle } from '@/utils/styleInline';
import { convertToPlainProps } from '@/utils/transfromProp';

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

export const useRenderItem = ({
  data,
  valueStream,
  index,
  methods,
  methodsArray,
}: {
  data: GridItem;
  valueStream?: any;
  index?: number;
  methods?: UseFormReturn<FieldValues, any, FieldValues>;
  methodsArray?: UseFieldArrayReturn<FieldValues, string, 'id'>;
}) => {
  const valueType = useMemo(() => data?.value?.toLowerCase() || '', [data?.value]);
  const { isNoChildren } = getComponentType(data?.value || '');
  const { dataState } = useHandleData({
    dataProp: getPropData(data),
    componentProps: data?.componentProps,
    valueStream,
    valueType,
    activeData: data,
    index,
  });

  const propsCpn = useDeepCompareMemo(() => {
    const staticProps: Record<string, any> = {
      ...dataState,
    };

    staticProps.css = buildStyle(staticProps);

    let result =
      valueType === 'menu'
        ? { ...staticProps }
        : {
            ...dataState,
            ...staticProps,
          };

    if (isNoChildren && 'children' in result) {
      _.unset(result, 'children');
    }

    if ('styleMultiple' in result) _.unset(result, 'styleMultiple');
    if ('dataProps' in result) _.unset(result, 'dataProps');

    const plainProps = convertToPlainProps(result);

    result = cleanProps(plainProps, valueType);

    return result;
  }, [dataState, isNoChildren, valueType]);

  return {
    valueType,
    propsCpn: {
      ...propsCpn,
    },
    dataState,
  };
};
