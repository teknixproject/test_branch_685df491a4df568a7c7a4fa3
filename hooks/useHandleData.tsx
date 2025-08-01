/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';
/* eslint-disable react-hooks/exhaustive-deps */
import { JSONPath } from 'jsonpath-plus';
import _ from 'lodash';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

import { stateManagementStore } from '@/stores';
import { customFunctionStore } from '@/stores/customFunction';
import { TConditionChildMap, TTypeSelect, TVariable } from '@/types';
import { TData, TDataField, TOptionApiResponse } from '@/types/dataItem';
import { GridItem } from '@/types/gridItem';
import { executeConditionalInData } from '@/uitls/handleConditionInData';
import { transformVariable } from '@/uitls/tranformVariable';
import { isTData } from '@/uitls/transfromProp';

import { handleCustomFunction } from './handleCustomFunction';
import { findRootConditionChild, handleCompareCondition } from './useConditionAction';

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
  const apiResponseState = stateManagementStore((state) => state.apiResponse);
  const findCustomFunction = customFunctionStore((state) => state.findCustomFunction);
  const [isProcessing, setIsProcessing] = useState(false);
  const appState = stateManagementStore((state) => state.appState);
  const componentState = stateManagementStore((state) => state.componentState);
  const globalState = stateManagementStore((state) => state.globalState);
  const [dataState, setDataState] = useState<any>();
  const itemInList = useRef(null);
  const findVariable = stateManagementStore((state) => state.findVariable);

  const handleInputValue = async (data: TData['valueInput']): Promise<any> => {
    return data;
  };

  //#region handle api
  const handleApiResponse = useCallback(
    async (data: TData) => {
      if (_.isEmpty(data)) return;
      const apiResponse = data.apiResponse;
      const variableId = apiResponse?.variableId || '';
      const variable = findVariable({ id: variableId, type: 'apiResponse' });

      const handleOption = async (
        item: NonNullable<TDataField<TOptionApiResponse>['options']>[number],
        value?: TVariable
      ) => {
        switch (item.option) {
          case 'jsonPath':
            const valueJsonPath = JSONPath({
              json: value?.value,
              path: (await getData(item.jsonPath as TData, {})) || '',
            });
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

      let value = variable as TVariable;
      for (const option of apiResponse?.options || []) {
        value = await handleOption(
          option as NonNullable<TDataField<TOptionApiResponse>['options']>[number],
          value
        );
      }
      if (_.isEmpty(variable)) return data.defaultValue;
      return value;
    },
    [findVariable]
  );

  //#region  handle state
  const handleState = useCallback(
    async (data: TData) => {
      const state = data[data.type] as TDataField;
      if ('variableId' in state || {}) {
        const variableId = state?.variableId || '';
        const variable = findVariable({ id: variableId, type: data.type as TTypeSelect });

        let value = variable?.value;

        for (const option of state?.options || []) {
          const optionItem = option as NonNullable<TDataField['options']>[number];

          switch (optionItem.option) {
            case 'noAction':
              break;
            case 'jsonPath':
              const jsonPathValue = await getData(optionItem.jsonPath as TData, {});
              const valueJsonPath = JSONPath({
                json: value,
                path: jsonPathValue || '',
              });
              value = valueJsonPath?.[0];
              break;

            case 'itemAtIndex':
              const index = await getData(optionItem?.itemAtIndex as TData, {});
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
                    getData,
                  });
                  return result;
                });
              }
              break;

            case 'sort':
              if (Array.isArray(value)) {
                const sortOption = optionItem.sortOrder || 'asc';
                const jsonPath = await getData(optionItem.jsonPath as TData, {});

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
    [findVariable]
  );

  //#region handle item list
  const handleItemInList = (data: TData, valueStream: any) => {
    const { jsonPath } = data.itemInList;
    if (jsonPath) {
      const result = JSONPath({
        json: valueStream || props.valueStream,
        path: jsonPath || '',
      })?.[0];
      return result;
    }
    return valueStream || props.valueStream;
  };

  //#region handle custom function
  //#region handle dynamic generate
  const handleDynamicGenerate = async (data: TData) => {
    const state = data[data.type] as TDataField;
    const dynamicItem = data.temp;

    let value = dynamicItem;

    for (const option of state?.options || []) {
      const optionItem = option as NonNullable<TDataField['options']>[number];

      switch (optionItem.option) {
        case 'jsonPath':
          const jsonPathValue = await getData(optionItem.jsonPath as TData, {});
          const valueJsonPath = JSONPath({
            json: value,
            path: jsonPathValue || '',
          });
          value = valueJsonPath?.[0];
          break;

        case 'itemAtIndex':
          const index = await getData(optionItem?.itemAtIndex as TData, {});
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
                getData,
              });
              return result;
            });
          }
          break;

        case 'sort':
          if (Array.isArray(value)) {
            const sortOption = optionItem.sortOrder || 'asc';
            const jsonPath = await getData(optionItem.jsonPath as TData, {});

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
    console.log('🚀 ~ handleParemeters ~ paramName:', paramName);

    if (!paramName) return '';
    const result = params[paramName];
    return result;
  };

  const handleCondition = async (data: TData) => {
    if (!data?.condition) return;
    const value = await executeConditionalInData(data?.condition, getData);
    return value;
  };

  const handleCallBack = async (data: TData, callbackArgs?: any[]) => {
    const state = data[data.type] as TData['callback'];
    if (!_.isEmpty(callbackArgs)) {
      const indexArg = state?.index;

      let value = callbackArgs?.[indexArg];

      for (const option of state?.options || []) {
        const optionItem = option as NonNullable<TDataField['options']>[number];

        switch (optionItem.option) {
          case OPTIONS_HANDLE.NO_ACTION:
            break;
          case OPTIONS_HANDLE.JSON_PATH:
            const jsonPathValue = await getData(optionItem.jsonPath as TData, {});
            const valueJsonPath = JSONPath({
              json: value,
              path: jsonPathValue || '',
            });
            value = valueJsonPath?.[0];
            break;

          case 'itemAtIndex':
            const index = await getData(optionItem?.itemAtIndex as TData, {});
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
                  getData,
                });
                return result;
              });
            }
            break;

          case OPTIONS_HANDLE.SORT:
            if (Array.isArray(value)) {
              const sortOption = optionItem.sortOrder || 'asc';
              const jsonPath = await getData(optionItem.jsonPath as TData, {});

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
                isList: state.isList,
                type: state.type,
                value: data.defaultValue,
              })
            );
        }
      }

      return value;
    }
  };
  const handleFormData = async (data: TData) => {
    const state = data[data.type] as TData['formData'];
    console.log('🚀 ~ handleFormData ~ state:', state);
    const select = state.select;
    let value = null;

    if (select === 'fieldValue') value = props.methods?.getValues(state.fieldName);
    else if (select === 'formData') {
      value = props.methods?.getValues();
    }
    console.log('🚀 ~ handleFormData ~ value:', value);
    if (select) {
      for (const option of state?.options || []) {
        const optionItem = option as NonNullable<TDataField['options']>[number];

        switch (optionItem.option) {
          case 'noAction':
            break;
          case 'jsonPath':
            const jsonPathValue = (await getData(optionItem.jsonPath as TData, {})) as string;
            const valueJsonPath = JSONPath({
              json: value,
              path: jsonPathValue || '',
            }) as any[];
            value = valueJsonPath?.[0];
            break;

          case 'itemAtIndex':
            const index = await getData(optionItem?.itemAtIndex as TData, {});
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
                  getData,
                });
                return result;
              });
            }
            break;

          case 'sort':
            if (Array.isArray(value)) {
              const sortOption = optionItem.sortOrder || 'asc';
              const jsonPath = await getData(optionItem.jsonPath as TData, {});

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
  //#region getData
  const getData = useCallback(
    async (
      data: TData | null | undefined,
      { valueStream, callbackArgs }: THandleDataParams = {} as THandleDataParams
    ): Promise<any> => {
      if (_.isEmpty(data) && valueStream) return valueStream;
      if (_.isEmpty(data) && props.valueStream) return props.valueStream;
      if (_.isEmpty(data) || !data.type) return data?.defaultValue || data?.valueInput;

      switch (data.type) {
        case 'valueInput':
          return handleInputValue(data.valueInput);
        case 'parameters':
          return await handleParemeters(data);
        case 'dynamicGenerate':
          return await handleDynamicGenerate(data);
        case 'apiResponse':
          return await handleState(data);
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
            findCustomFunction,
            getData,
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
    [
      handleApiResponse,
      handleState,
      handleInputValue,
      handleItemInList,
      handleDynamicGenerate,
      handleCustomFunction,
      handleCondition,
      findCustomFunction,
      props,
    ]
  );
  //#region tracking

  //#region handle main
  // Fixed useEffect - only update when data actually changes
  // useEffect(() => {
  //   if (dataPropRef) {
  //     const newDataState = getData(dataPropRef.current);
  //     // Only update state if the value actually changed
  //     setDataState((prevState: any) => {
  //       if (!_.isEqual(prevState, newDataState)) {
  //         return newDataState;
  //       }
  //       return prevState;
  //     });
  //   }
  // }, [apiResponseTracking, appStateTracking, componentStateTracking, globalStateTracking]);
  const getTrackedData = useCallback((data: TData | null | undefined, valueStream?: any) => {
    const result = getData(data, valueStream);
    return result;
  }, []);

  const processDataState = useCallback(async () => {
    // if (isProcessing) return;
    // setIsProcessing(true);

    try {
      const newDataState: any = {};

      if (props?.dataProp?.length) {
        const dataPromises = props.dataProp.map(async (item) => {
          const value = await getData(item.data, {
            valueStream: props.valueStream,
          });
          return { name: item.name, value };
        });

        const resolvedData = await Promise.all(dataPromises);
        resolvedData.forEach(({ name, value }) => {
          newDataState[name] = value;
        });
      }

      if (props?.componentProps) {
        const componentPromises = Object.entries(props.componentProps).map(async ([key, value]) => {
          if (isTData(value)) {
            const data = {
              type: value.type,
              [value.type]: value[value.type],
            } as TData;

            let valueConvert = await getData(data, {
              valueStream: props.valueStream,
            });
            if (props.valueType?.toLowerCase() === 'datepicker') {
              if (key === 'value' || key === 'defaultValue') {
                valueConvert = valueConvert ? dayjs(valueConvert) : dayjs();
              }
            }
            return { key, value: valueConvert };
          }
          return { key, value };
        });

        const resolvedComponents = await Promise.all(componentPromises);

        resolvedComponents.forEach(({ key, value }) => {
          newDataState[key] = value;
        });
      }

      setDataState((prevState: any) => {
        if (_.isEqual(prevState, newDataState)) return prevState;
        return newDataState;
      });
    } catch (error) {
      console.error('Error processing data state:', error);
    } finally {
      // setIsProcessing(false);
    }
  }, [
    props?.dataProp,
    props?.componentProps,
    props?.valueStream,
    props?.valueType,
    appState,
    globalState,
    componentState,
    apiResponseState,
    // isProcessing,
  ]);
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    // if (hasProcessed) return;

    const run = async () => {
      await processDataState();
      // setHasProcessed(true);
    };

    run();
  }, [appState, globalState, componentState, apiResponseState]);

  // const dataState = useMemo(() => {
  //   const dataMultiple = props?.dataProp?.reduce(async (obj, item) => {
  //     return {
  //       ...obj,
  //       [item.name]: await getData(item.data, props.valueStream),
  //     };
  //   }, {});

  //   const componentConverted = Object.entries(props?.componentProps || {}).reduce(
  //     async (obj, [key, value]) => {
  //       if (isTData(value)) {
  //         const data = {
  //           type: value.type,
  //           [value.type]: value[value.type],
  //         } as TData;

  //         let valueConvert = await getData(data, props.valueStream);
  //         console.log('🚀 ~ useHandleData ~ valueConvert:', valueConvert);

  //         if (props.valueType?.toLowerCase() === 'datepicker') {
  //           if (key === 'value' || key === 'defaultValue') {
  //             valueConvert = dayjs(valueConvert);
  //           }
  //         }
  //         return {
  //           ...obj,
  //           [key]: valueConvert,
  //         };
  //       }
  //       return {
  //         ...obj,
  //         [key]: value,
  //       };
  //     },
  //     {}
  //   );
  //   const reslt = {
  //     ...dataMultiple,
  //     ...componentConverted,
  //   };

  //   return reslt;
  // }, [
  //   appState,
  //   globalState,
  //   componentState,
  //   apiResponseState,
  //   props?.componentProps,
  //   props?.valueStream,
  //   props?.dataProp,
  // ]);
  return {
    getData,
    dataState,
    getTrackedData,
  };
};
