/** @jsxImportSource @emotion/react */
import _ from 'lodash';
import { useMemo } from 'react';
import { FieldValues, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { useDeepCompareMemo } from 'use-deep-compare';

import { componentRegistry } from '@/components/grid-systems/ListComponent';
import { useActions } from '@/hooks/useActions';
import { useHandleData } from '@/hooks/useHandleData';
import { useHandleProps } from '@/hooks/useHandleProps';
import { stateManagementStore } from '@/stores';
import { GridItem } from '@/types/gridItem';
import { getComponentType } from '@/utils/component';
import { cleanProps } from '@/utils/renderItem';
import {
  convertCssObjectToCamelCase,
  convertCSSTringToObject,
  convertToEmotionStyle,
} from '@/utils/styleInline';
import { convertToPlainProps } from '@/utils/transfromProp';
import { css } from '@emotion/react';

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
const getPropData = (data: GridItem) =>
  data?.componentProps?.dataProps?.filter((item: any) => item.type === 'data');

const getPropActions = (data: GridItem) =>
  data?.componentProps?.dataProps?.filter((item: any) => item.type.includes('MouseEventHandler'));

const buildStyle = (staticProps: Record<string, any>) => {
  const cssObject = convertCSSTringToObject(staticProps?.styleExtra);
  console.log('🚀 ~ buildStyle ~ cssObject:', cssObject);

  const advancedCss = {
    ...convertToEmotionStyle({
      ...staticProps?.styleMultiple,
    }),
    ...cssObject,
  };

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
  const { isLoading } = useActions({
    data,
    valueStream,
    methods,
    methodsArray,
    isCallPageLoad: true,
  });
  const findVariable = stateManagementStore((state) => state.findVariable);
  const { dataState } = useHandleData({
    dataProp: getPropData(data),
    componentProps: data?.componentProps,
    valueStream,
    valueType,
    activeData: data,
    index,
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
      ...dataState,
    };

    staticProps.css = buildStyle(staticProps);

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
