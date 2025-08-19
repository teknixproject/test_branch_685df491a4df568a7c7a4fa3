/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';
/* eslint-disable react-hooks/exhaustive-deps */
import { JSONPath } from 'jsonpath-plus';
import _, { isEqual } from 'lodash';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { useDeepCompareMemo } from 'use-deep-compare';

import { stateManagementStore } from '@/stores';
import { customFunctionStore } from '@/stores/customFunction';
import { TConditionChildMap, TTypeSelect, TVariable } from '@/types';
import { TData, TDataField, TOptionApiResponse } from '@/types/dataItem';
import { GridItem } from '@/types/gridItem';
import { executeConditionalInData } from '@/utils/handleConditionInData';
import { transformVariable } from '@/utils/tranformVariable';
import { isTData } from '@/utils/transfromProp';

import { handleCustomFunction } from './handleCustomFunction';
import { findRootConditionChild, handleCompareCondition } from './useConditionAction';

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

enum OPTIONS_HANDLE {
  NO_ACTION = 'noAction',
  JSON_PATH = 'jsonPath',
  ITEM_IN_LIST = 'itemInList',
  FILTER = 'filter',
  SORT = 'sort',
}

type UseHandleDataReturn = {
  dataState?: any;
  getData: (data: TData | null | undefined, params?: THandleDataParams) => any;
  getTrackedData: (data: TData | null | undefined, valueStream?: any) => any;
};

const handleCompareValue = ({
  conditionChildMap,
  getData,
}: {
  conditionChildMap: TConditionChildMap;
  getData: any;
}) => {
  if (_.isEmpty(conditionChildMap)) return;
  const rootCondition = findRootConditionChild(conditionChildMap);

  return handleCompareCondition(rootCondition?.id || '', conditionChildMap, getData);
};

type TUseHandleData = {
  dataProp?: { name: string; data: TData }[];
  componentProps?: Record<string, TData>;
  valueStream?: any;
  valueType?: string;
  activeData?: GridItem;
  methods?: UseFormReturn<FieldValues, any, FieldValues>;
};

const getIdInData = (data: TData) => {
  const type = data?.type;
  if (['appState', 'componentState', 'globalState', 'apiResponseState'].includes(type)) {
    return data[type].variableId;
  }
};

const getVariableIdsFormData = (dataProps: TUseHandleData['dataProp']) => {
  const ids = dataProps?.map((item) => getIdInData(item.data));
  const cleaned = _.compact(ids);
  return cleaned;
};

export type THandleDataParams = {
  valueStream?: any;
  callbackArgs?: any[];
};

export const useHandleData = (props: TUseHandleData): UseHandleDataReturn => {
  const params = useParams();
  const findCustomFunction = customFunctionStore((state) => state.findCustomFunction);
  const [dataState, setDataState] = useState<any>();
  const itemInList = useRef(null);
  const findVariable = stateManagementStore((state) => state.findVariable);

  // FIX: Use ref to prevent infinite re-renders
  const getDataRef = useRef<any>(null);

  const variableids = useDeepCompareMemo(
    () => extractVariableIdsWithLodash(props.activeData),
    [props.activeData]
  );

  // FIX: Stabilize dependencies with useMemo
  const stableDeps = useDeepCompareMemo(
    () => ({
      valueStream: props.valueStream,
      methods: props.methods,
      params,
      findVariable,
      findCustomFunction,
    }),
    [props.valueStream, props.methods, params, findVariable, findCustomFunction]
  );

  const handleInputValue = async (data: TData['valueInput']): Promise<any> => {
    return data;
  };

  const handleItemInList = (data: TData, valueStream: any) => {
    const { jsonPath } = data.itemInList;
    if (jsonPath) {
      const result = JSONPath({
        json: valueStream || stableDeps.valueStream,
        path: jsonPath || '',
      })?.[0];
      return result;
    }
    return valueStream || stableDeps.valueStream;
  };

  const handleDynamicGenerate = async (data: TData) => {
    const state = data[data.type] as TDataField;
    const dynamicItem = data.temp;

    let value = dynamicItem;

    for (const option of state?.options || []) {
      const optionItem = option as NonNullable<TDataField['options']>[number];

      switch (optionItem.option) {
        case OPTIONS_HANDLE.NO_ACTION:
          break;
        case 'jsonPath':
          const jsonPathValue = await getDataRef.current(optionItem.jsonPath as TData, {});
          const valueJsonPath = JSONPath({
            json: value,
            path: jsonPathValue || '',
          });
          value = valueJsonPath?.[0];
          break;

        case 'itemAtIndex':
          const index = await getDataRef.current(optionItem?.itemAtIndex as TData, {});
          let indexValid: number = 0;
          if (typeof index !== 'number') {
            indexValid = parseInt(index);
          }
          value = value[indexValid];
          break;

        case 'filter':
          if (Array.isArray(value)) {
            value = value.filter((item: any) => {
              itemInList.current = item;
              const result = handleCompareValue({
                conditionChildMap: optionItem.filterCondition?.data as TConditionChildMap,
                getData: getDataRef.current,
              });
              return result;
            });
          }
          break;

        case 'sort':
          if (Array.isArray(value)) {
            const sortOption = optionItem.sortOrder || 'asc';
            const jsonPath = await getDataRef.current(optionItem.jsonPath as TData, {});

            value = [...value].sort((a: any, b: any) => {
              let aVal = a;
              let bVal = b;

              if (jsonPath) {
                const aJsonPath = JSONPath({ json: a, path: jsonPath });
                const bJsonPath = JSONPath({ json: b, path: jsonPath });
                aVal = aJsonPath[0];
                bVal = bJsonPath[0];
              }

              if (sortOption === 'asc') {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
              } else {
                return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
              }
            });
          }
          break;

        case 'length':
          return value?.length || 0;
        case 'isEmpty':
          return _.isEmpty(value);
        case 'isNotEmpty':
          return !_.isEmpty(value);
        default:
          return value || data?.defaultValue;
      }
    }

    return value;
  };

  const handleParemeters = (data: TData) => {
    const paramName = data?.parameters?.paramName;

    if (!paramName) return '';
    const result = stableDeps.params[paramName];
    return result;
  };

  const handleCondition = async (data: TData) => {
    if (!data?.condition) return;
    const value = await executeConditionalInData(data?.condition, getDataRef.current);
    return value;
  };

  const handleCallBack = async (data: TData, callbackArgs?: any[]) => {
    const state = data[data.type] as TData['callback'];
    if (!_.isEmpty(callbackArgs)) {
      const indexArg = state?.index;
      let value = callbackArgs?.[indexArg];

      if (value?.target?.value !== undefined) {
        value = value.target.value;
      } else if (value?.target?.checked !== undefined) {
        value = value.target.checked;
      }

      for (const option of state?.options || []) {
        const optionItem = option as NonNullable<TDataField['options']>[number];

        switch (optionItem.option) {
          case OPTIONS_HANDLE.NO_ACTION:
            break;
          case OPTIONS_HANDLE.JSON_PATH:
            const jsonPathValue = await getDataRef.current(optionItem.jsonPath as TData, {});
            const valueJsonPath = JSONPath({
              json: value,
              path: jsonPathValue || '',
            });
            value = valueJsonPath?.[0];
            break;

          case 'itemAtIndex':
            const index = await getDataRef.current(optionItem?.itemAtIndex as TData, {});
            let indexValid: number = 0;
            if (typeof index !== 'number') {
              indexValid = parseInt(index);
            }
            value = value[indexValid];
            break;

          case OPTIONS_HANDLE.FILTER:
            if (Array.isArray(value)) {
              value = value.filter((item: any) => {
                itemInList.current = item;
                const result = handleCompareValue({
                  conditionChildMap: optionItem.filterCondition?.data as TConditionChildMap,
                  getData: getDataRef.current,
                });
                return result;
              });
            }
            break;

          case OPTIONS_HANDLE.SORT:
            if (Array.isArray(value)) {
              const sortOption = optionItem.sortOrder || 'asc';
              const jsonPath = await getDataRef.current(optionItem.jsonPath as TData, {});

              value = [...value].sort((a: any, b: any) => {
                let aVal = a;
                let bVal = b;

                if (jsonPath) {
                  const aJsonPath = JSONPath({ json: a, path: jsonPath });
                  const bJsonPath = JSONPath({ json: b, path: jsonPath });
                  aVal = aJsonPath[0];
                  bVal = bJsonPath[0];
                }

                if (sortOption === 'asc') {
                  return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
                } else {
                  return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
                }
              });
            }
            break;

          case 'length':
            return value?.length || 0;
          case 'isEmpty':
            return _.isEmpty(value);
          case 'isNotEmpty':
            return !_.isEmpty(value);
          default:
            return value;
        }
      }

      return value;
    }
  };

  const handleFormData = async (data: TData) => {
    const state = data[data.type] as TData['formData'];
    const select = state.select;
    let value = null;

    if (select === 'fieldValue') value = stableDeps.methods?.getValues(state.fieldName);
    else if (select === 'formData') {
      value = stableDeps.methods?.getValues();
    }
    if (select) {
      for (const option of state?.options || []) {
        const optionItem = option as NonNullable<TDataField['options']>[number];

        switch (optionItem.option) {
          case 'noAction':
            break;
          case 'jsonPath':
            const jsonPathValue = (await getDataRef.current(
              optionItem.jsonPath as TData,
              {}
            )) as string;
            const valueJsonPath = JSONPath({
              json: value,
              path: jsonPathValue || '',
            }) as any[];
            value = valueJsonPath?.[0];
            break;

          case 'itemAtIndex':
            const index = await getDataRef.current(optionItem?.itemAtIndex as TData, {});
            let indexValid: number = 0;
            if (typeof index !== 'number') {
              indexValid = parseInt(index);
            }
            value = value[indexValid];
            break;

          case 'filter':
            if (Array.isArray(value)) {
              value = value.filter((item: any) => {
                itemInList.current = item;
                const result = handleCompareValue({
                  conditionChildMap: optionItem.filterCondition?.data as TConditionChildMap,
                  getData: getDataRef.current,
                });
                return result;
              });
            }
            break;

          case 'sort':
            if (Array.isArray(value)) {
              const sortOption = optionItem.sortOrder || 'asc';
              const jsonPath = await getDataRef.current(optionItem.jsonPath as TData, {});

              value = [...value].sort((a: any, b: any) => {
                let aVal = a;
                let bVal = b;

                if (jsonPath) {
                  const aJsonPath = JSONPath({ json: a, path: jsonPath });
                  const bJsonPath = JSONPath({ json: b, path: jsonPath });
                  aVal = aJsonPath[0];
                  bVal = bJsonPath[0];
                }

                if (sortOption === 'asc') {
                  return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
                } else {
                  return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
                }
              });
            }
            break;

          case 'length':
            return value?.length || 0;
          case 'isEmpty':
            return _.isEmpty(value);
          case 'isNotEmpty':
            return !_.isEmpty(value);
          default:
            return value;
        }
      }

      return value;
    }
  };

  // Handle API Response
  const handleApiResponse = useCallback(
    async (data: TData) => {
      if (_.isEmpty(data)) return;
      const apiResponse = data.apiResponse;
      const variableId = apiResponse?.variableId || '';
      const variable = stableDeps.findVariable({ id: variableId, type: 'apiResponse' });

      const handleOption = async (
        item: NonNullable<TDataField<TOptionApiResponse>['options']>[number],
        value?: TVariable
      ) => {
        switch (item?.option) {
          case OPTIONS_HANDLE.NO_ACTION:
            return value;
          case 'jsonPath':
            const valueJsonPath = JSONPath({
              json: value?.value,
              path: (await getDataRef.current(item.jsonPath as TData, {})) || '',
            }) as any[];
            return valueJsonPath?.[0];
          case 'statusCode':
            return value?.statusCode;
          case 'succeeded':
            return value?.succeeded;
          case 'isEmpty':
            return _.isEmpty(value);
          case 'isNotEmpty':
            return !_.isEmpty(value);
          case 'exceptionMessage':
            return value?.message;
          default:
            return (
              value?.value ||
              transformVariable({
                ...variable!,
                value: data.defaultValue,
              })
            );
        }
      };

      let value = variable;
      for (const option of apiResponse?.options || []) {
        value = await handleOption(
          option as NonNullable<TDataField<TOptionApiResponse>['options']>[number],
          value
        );
      }
      return value;
    },
    [stableDeps]
  );

  // Handle State
  const handleState = useCallback(
    async (data: TData) => {
      const state = data[data.type] as TDataField;
      if ('variableId' in state || {}) {
        const variableId = state?.variableId || '';
        const variable = stableDeps.findVariable({
          id: variableId,
          type: data.type as TTypeSelect,
        });

        let value = variable?.value;

        for (const option of state?.options || []) {
          const optionItem = option as NonNullable<TDataField['options']>[number];

          switch (optionItem.option) {
            case 'noAction':
              break;
            case 'jsonPath':
              const jsonPathValue = await getDataRef.current(optionItem.jsonPath as TData, {});
              const valueJsonPath = JSONPath({
                json: value,
                path: jsonPathValue || '',
              });
              value = valueJsonPath?.[0];
              break;

            case 'itemAtIndex':
              const index = await getDataRef.current(optionItem?.itemAtIndex as TData, {});
              let indexValid: number = 0;
              if (typeof index !== 'number') {
                indexValid = parseInt(index);
              }
              value = value[indexValid];
              break;

            case 'filter':
              if (Array.isArray(value)) {
                value = value.filter((item: any) => {
                  itemInList.current = item;
                  const result = handleCompareValue({
                    conditionChildMap: optionItem.filterCondition?.data as TConditionChildMap,
                    getData: getDataRef.current,
                  });
                  return result;
                });
              }
              break;

            case 'sort':
              if (Array.isArray(value)) {
                const sortOption = optionItem.sortOrder || 'asc';
                const jsonPath = await getDataRef.current(optionItem.jsonPath as TData, {});

                value = [...value].sort((a: any, b: any) => {
                  let aVal = a;
                  let bVal = b;

                  if (jsonPath) {
                    const aJsonPath = JSONPath({ json: a, path: jsonPath });
                    const bJsonPath = JSONPath({ json: b, path: jsonPath });
                    aVal = aJsonPath[0];
                    bVal = bJsonPath[0];
                  }

                  if (sortOption === 'asc') {
                    return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
                  } else {
                    return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
                  }
                });
              }
              break;

            case 'length':
              return value?.length || 0;
            case 'isEmpty':
              return _.isEmpty(value);
            case 'isNotEmpty':
              return !_.isEmpty(value);
            default:
              return (
                value ||
                transformVariable({
                  ...variable!,
                  value: data.defaultValue,
                })
              );
          }
        }

        return value;
      }
    },
    [stableDeps]
  );

  // Main getData function - FIX: Use stable dependencies
  const getData = useCallback(
    async (
      data: TData | null | undefined,
      { valueStream, callbackArgs }: THandleDataParams = {} as THandleDataParams
    ): Promise<any> => {
      if (_.isEmpty(data) && valueStream) return valueStream;
      if (_.isEmpty(data) && stableDeps.valueStream) return stableDeps.valueStream;
      if (_.isEmpty(data) || !data.type) return data?.defaultValue || data?.valueInput;

      switch (data.type) {
        case 'valueInput':
          return handleInputValue(data.valueInput);
        case 'parameters':
          return await handleParemeters(data);
        case 'dynamicGenerate':
          return await handleDynamicGenerate(data);
        case 'apiResponse':
          return await handleApiResponse(data);
        case 'appState':
          return await handleState(data);
        case 'componentState':
          return await handleState(data);
        case 'globalState':
          return await handleState(data);
        case 'combineText':
          return data.combineText;
        case 'itemInList':
          return await handleItemInList(data, valueStream);
        case 'customFunction':
          return await handleCustomFunction({
            data: data.customFunction,
            findCustomFunction: stableDeps.findCustomFunction,
            getData: getDataRef.current,
          });
        case 'condition':
          return await handleCondition(data);
        case 'callback':
          return await handleCallBack(data, callbackArgs);
        case 'formData':
          return await handleFormData(data);
        default:
          return data?.defaultValue || data.valueInput;
      }
    },
    [handleApiResponse, handleState, stableDeps]
  );

  // FIX: Update ref when getData changes
  useEffect(() => {
    getDataRef.current = getData;
  }, [getData]);

  // FIX: Use deep comparison for props to prevent unnecessary re-runs
  const stableProps = useDeepCompareMemo(
    () => ({
      dataProp: props?.dataProp,
      componentProps: props?.componentProps,
      valueStream: props?.valueStream,
      valueType: props?.valueType,
    }),
    [props?.dataProp, props?.componentProps, props?.valueStream, props?.valueType]
  );

  // Process data state - FIX: Remove getData from dependencies, use stable props
  const processDataState = useCallback(async () => {
    try {
      const newDataState: any = {};

      if (stableProps.dataProp?.length) {
        const dataPromises = stableProps.dataProp.map(async (item) => {
          const value = await getDataRef.current(item.data, {
            valueStream: stableProps.valueStream,
          });
          return { name: item.name, value };
        });

        const resolvedData = await Promise.all(dataPromises);
        resolvedData.forEach(({ name, value }) => {
          newDataState[name] = value;
        });
      }

      if (stableProps.componentProps) {
        const componentPromises = Object.entries(stableProps.componentProps).map(
          async ([key, value]) => {
            if (isTData(value)) {
              const data = {
                type: value.type,
                [value.type]: value[value.type],
              } as TData;

              let valueConvert = await getDataRef.current(data, {
                valueStream: stableProps.valueStream,
              });

              if (stableProps.valueType?.toLowerCase() === 'datepicker') {
                if (key === 'value' || key === 'defaultValue') {
                  valueConvert = valueConvert ? dayjs(valueConvert) : dayjs();
                }
              }
              return { key, value: valueConvert };
            }
            return { key, value };
          }
        );

        const resolvedComponents = await Promise.all(componentPromises);
        resolvedComponents.forEach(({ key, value }) => {
          newDataState[key] = value;
        });
      }

      setDataState((prevState: any) => {
        if (_.isEqual(prevState, newDataState)) {
          // console.log('Data state unchanged, skipping update');
          return prevState;
        }
        return newDataState;
      });
    } catch (error) {
      console.error('Error processing data state:', error);
    }
  }, [stableProps]); // FIX: Only depend on stable props

  const getTrackedData = useCallback((data: TData | null | undefined, valueStream?: any) => {
    return getDataRef.current(data, { valueStream });
  }, []);

  // FIX: Only run once on mount and when stableProps change significantly
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      processDataState();
    }
  }, []);

  // FIX: Run when stable props actually change
  useEffect(() => {
    if (hasInitialized.current) {
      processDataState();
    }
  }, [processDataState]);

  // Subscribe to state changes - FIX: Prevent multiple subscriptions
  useEffect(() => {
    if (!variableids.length) {
      return;
    }

    const unsub = stateManagementStore.subscribe(
      (state) => [
        ...Object.values(state.apiResponse || {}).filter(
          (item) => item.id && variableids.includes(item.id)
        ),
        ...Object.values(state.componentState || {}).filter(
          (item) => item.id && variableids.includes(item.id)
        ),
        ...Object.values(state.globalState || {}).filter(
          (item) => item.id && variableids.includes(item.id)
        ),
        ...Object.values(state.appState || {}).filter(
          (item) => item.id && variableids.includes(item.id)
        ),
      ],
      (value, prev) => {
        if (isEqual(value, prev)) {
          return;
        }

        processDataState();
      }
    );

    return () => {
      unsub();
    };
  }, [variableids]);

  return {
    getData,
    dataState,
    getTrackedData,
  };
};
