import _ from 'lodash';

import { TData } from '@/types';

export const convertFieldValue = (value: any) => {
  if (typeof value !== 'object') {
    return {
      valueInput: value,
      type: 'valueInput',
    } as TData;
  }
  return value;
};

export const convertDataToSingleProp = ({
  propName,
  valueProp,
}: {
  propName: string;
  valueProp: TData;
}) => {
  return {
    [propName]:
      _.get(valueProp, 'type') === 'valueInput' ? _.get(valueProp, 'valueInput') : valueProp,
  };
};

export const convertDataToProps = (props: Record<string, TData>): Record<string, any> => {
  return _.reduce(
    props,
    (result, valueProp, key) => {
      return _.assign(result, convertDataToSingleProp({ propName: key, valueProp }));
    },
    {}
  );
};

export const convertToPlainProps = (props: Record<string, any>, getData: any) => {
  // Initialize result with a deep clone to ensure no read-only issues
  const result: Record<string, any> = _.cloneDeep({});

  for (const [key, val] of Object.entries(props)) {
    if (key.includes('-')) {
      // Handle dash-separated fields (e.g., style-fill -> style.fill)
      const path = key.split('-');
      const processedVal = isTData(val) ? getData(val) : _.cloneDeep(val); // Deep clone to avoid read-only issues
      // Ensure the target object is writable
      let target = result;
      for (let i = 0; i < path.length - 1; i++) {
        const part = path[i];
        // Create nested object if it doesn't exist or is read-only
        if (!target[part] || Object.isFrozen(target[part]) || Object.isSealed(target[part])) {
          target[part] = {};
        }
        target = target[part];
      }
      target[path[path.length - 1]] = processedVal;
    } else if (!isTData(val)) {
      // Non-TData, non-dashed keys
      result[key] = _.cloneDeep(val); // Deep clone to avoid read-only issues
    } else {
      // TData, non-dashed keys
      const converted = getData(val);
      result[key] = converted;
    }
  }

  return result;
};
// export const convertToPlainProps = (props: Record<string, any>, getData: any) => {
//   const result: Record<string, any> = {};
//   for (const [key, val] of Object.entries(props)) {
//     if (!isTData(val)) result[key] = val;
//     else {
//       const converted = getData(val);
//       result[key] = converted;
//     }
//   }
//   return result;
// };
export const isTData = (value: any): value is TData => {
  // Must be a plain object
  if (!_.isPlainObject(value)) {
    return false;
  }
  if (_.isPlainObject(value) && 'valueInput' in value) {
    return true;
  }

  // Check if 'type' exists and is a valid key
  const validTypes: (keyof Omit<TData, 'type' | 'defaultValue'>)[] = [
    'itemInList',
    'parameters',
    'formData',
    'dynamicGenerate',
    'apiResponse',
    'appState',
    'componentState',
    'globalState',
    'apiCall',
    'customFunction',
    'condition',
    'valueInput',
  ];
  if (!('type' in value) || !validTypes.includes(value.type)) {
    return false;
  }

  return true;
};
