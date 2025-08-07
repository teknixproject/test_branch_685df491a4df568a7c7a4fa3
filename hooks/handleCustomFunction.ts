import _ from 'lodash';

import { TCustomFunction, TTypeVariable } from '@/types';
import { TData } from '@/types/dataItem';

import { THandleDataParams } from './useHandleData';

function convertValueByType(value: any, type: TTypeVariable, isList = false): any {
  if (value == null) return null;

  const parseOne = (v: any) => {
    switch (type.toLowerCase()) {
      case 'string':
        return String(v);
      case 'integer':
        return parseInt(v, 10);
      case 'float':
        return parseFloat(v);
      case 'boolean':
        return v === 'true' || v === true;
      case 'date':
        return new Date(v);
      case 'object':
        try {
          return typeof v === 'object' ? v : JSON.parse(v);
        } catch {
          return null;
        }
      default:
        return v;
    }
  };

  if (isList) {
    try {
      const arr = Array.isArray(value) ? value : JSON.parse(value);
      return arr.map(parseOne);
    } catch {
      return [];
    }
  }

  return parseOne(value);
}

type THandleCustomData = {
  data: TData['customFunction'];
  getData: (data: TData | null, params?: THandleDataParams) => any;
  findCustomFunction: (id: string) => TCustomFunction;
  params?: THandleDataParams;
};
export const handleCustomFunction = async ({
  data,
  getData,
  findCustomFunction,
  params,
}: THandleCustomData): Promise<any> => {
  async function buildArgsFromDefinedProps(
    props: TCustomFunction['props'],
    inputs: TData['customFunction']['props']
  ) {
    const args: Record<string, any> = {};

    for (const prop of props) {
      if (!prop.key) return;

      const input = inputs?.find((item) => item.key === prop.key);

      const rawData = await getData(input?.value || null, params);

      args[prop.key] = convertValueByType(rawData, prop.type, prop.isList);
    }

    return args;
  }
  const customFunction = findCustomFunction(data.customFunctionId);

  if (_.isEmpty(customFunction)) return;
  const args = await buildArgsFromDefinedProps(customFunction?.props, data?.props);

  const runFunction = async () => {
    try {
      const fn = new Function(`return ${customFunction.code}`)() as (args: any) => any;

      if (typeof fn === 'function') {
        const result = await fn(args);

        return result;
      } else {
        throw new Error('Invalid function');
      }
    } catch (error) {
      throw error;
    }
  };
  return await runFunction();
};
