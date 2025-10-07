import _ from 'lodash';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FieldValues, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { useDeepCompareMemo } from 'use-deep-compare';

import { TAction, TTriggerActions, TTriggerValue } from '@/types';
import { GridItem } from '@/types/gridItem';

import { useActions } from './useActions';

// interface TDataProps {
//   name: string;
//   type: 'data' | 'MouseEventHandler';
//   data: TTriggerActions;
// }

interface UseHandlePropsResult {
  actions: Record<string, React.MouseEventHandler<HTMLButtonElement>>;
  loading: Record<string, boolean>; // FIX: Thêm loading state
  isLoading: boolean; // FIX: Global loading state
}

interface UseHandlePropsProps {
  dataProps: TTriggerActions;
  valueStream: any;
  data?: GridItem;
  methods?: UseFormReturn<FieldValues, any, FieldValues>;
  methodsArray?: UseFieldArrayReturn<FieldValues, string, 'id'>;
}

// Constants
const ACTION_TYPES = {
  NAVIGATE: 'navigate',
  API_CALL: 'apiCall',
  UPDATE_STATE: 'updateStateManagement',
  UPDATE_FORM_STATE: 'updateFormState',
} as const;

const FC_TYPES = {
  ACTION: 'action',
  CONDITIONAL: 'conditional',
} as const;

const DEFAULT_TRIGGER: TTriggerValue = 'onClick';

// const createActionsMap = (dataProps: TTriggerActions): Record<string, TTriggerActions> => {
//   const map: Record<string, TTriggerActions> = {};

//   dataProps?.forEach((item) => {
//     if (!_.isEmpty(item.data)) {
//       map[item.name] = item.data;
//     }
//   });

//   return map;
// };

const findRootAction = (actionsToExecute: Record<string, TAction>): TAction | undefined => {
  return Object.values(actionsToExecute).find((action) => !action.parentId);
};

const validateActionMap = (actionMap: TTriggerActions | undefined, actionName: string): boolean => {
  if (!actionMap) {
    console.warn(`No actions found for: ${actionName}`);
    return false;
  }
  return true;
};

const useHandleProps = (props: UseHandlePropsProps): UseHandlePropsResult => {
  const { dataProps } = props;
  console.log('🚀 ~ useHandleProps ~ dataProps:', dataProps);

  // FIX: Add loading states
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Store references for debounced functions
  const debouncedFunctionsRef = useRef<Record<string, any>>({});

  // Step 1: Tạo actions map từ dataProps
  // const actionsMap = useMemo(() => {
  //   return createActionsMap(dataProps);
  // }, [dataProps]);

  const actionsMap = dataProps;
  // Step 2: Lấy executeTriggerActions từ useActions hook
  const { executeTriggerActions } = useActions({ ...props, isCallPageLoad: false });

  // FIX: Helper functions for loading state management
  const setActionLoading = useCallback((actionName: string, loading: boolean) => {
    // setLoadingStates((prev) => ({
    //   ...prev,
    //   [actionName]: loading,
    // }));
  }, []);

  const resetAllLoadingStates = useCallback(() => {
    // setLoadingStates({});
  }, []);

  // FIX: Computed loading state
  const isLoading = useMemo(() => {
    return Object.values(loadingStates).some((loading) => loading);
  }, [loadingStates]);

  // Step 3: Tạo stable execute function với useCallback - FIX: Add loading handling
  const createExecuteHandler = useCallback(
    (actionMap: TTriggerActions, itemName: string) => {
      return async (...callbackArgs: any[]) => {
        try {
          // FIX: Set loading state before execution
          setActionLoading(itemName, true);

          // Persist tất cả React SyntheticEvent trong args
          // callbackArgs.forEach((arg) => {
          //   if (
          //     arg &&
          //     typeof arg === 'object' &&
          //     'persist' in arg &&
          //     typeof arg.persist === 'function'
          //   ) {
          //     arg.persist();
          //   }
          // });

          // Validate action map
          if (!validateActionMap(actionMap, itemName)) {
            return;
          }

          // Execute trigger actions directly
          await executeTriggerActions(actionMap, DEFAULT_TRIGGER, { callbackArgs });
        } catch (error) {
          console.error(`Error executing action ${itemName}:`, error);
          // Optionally handle error state here
        } finally {
          // FIX: Always clear loading state after execution
          setActionLoading(itemName, false);
        }
      };
    },
    [executeTriggerActions, setActionLoading]
  );

  // Step 4: Tạo mouse event handlers với stable debounce - FIX: Enhanced with loading
  // Step 4: Tạo mouse event handlers với stable debounce - FIX: dùng key
  const mouseEventHandlers = useDeepCompareMemo(() => {
    if (!actionsMap) return {};

    const result: Record<string, React.MouseEventHandler<HTMLButtonElement>> = {};
    const actionJson = actionsMap;
    // Lọc data không rỗng và iterate key/value
    Object.entries(actionJson).forEach(([key, value]) => {
      if (!value) return;
      const actionData = { ...(value.data?.onClick || {}), ...(value.data || {}) };
      // Lấy root action
      const rootAction = findRootAction(actionData);

      const actionMap = actionsMap[key];
      if (!actionMap) return;

      // Tạo execute handler
      const executeHandler = createExecuteHandler(actionMap, key);

      // Kiểm tra debounce
      if (rootAction?.delay && rootAction.delay > 0) {
        const cacheKey = `${key}_${rootAction.delay}`;

        if (!debouncedFunctionsRef.current[cacheKey]) {
          const debouncedHandler = _.debounce(async (...args: any[]) => {
            await executeHandler(...args);
          }, rootAction.delay);

          // Wrap để xử lý loading state
          debouncedFunctionsRef.current[cacheKey] = async (...args: any[]) => {
            setActionLoading(key, true);

            try {
              await debouncedHandler(...args);
            } catch (error) {
              console.error(`Error in debounced action ${key}:`, error);
              setActionLoading(key, false);
            }
            // Note: loading state sẽ được clear trong executeHandler
          };
        }

        result[key] = debouncedFunctionsRef.current[cacheKey];
      } else {
        result[key] = executeHandler;
      }
    });

    console.log('🚀 ~ useHandleProps ~ result:', result);
    return result;
  }, [dataProps, actionsMap, createExecuteHandler, setActionLoading]);

  // Cleanup debounced functions when component unmounts or when actions change
  const cleanupDebouncedFunctions = useCallback(() => {
    Object.values(debouncedFunctionsRef.current).forEach((debouncedFn: any) => {
      if (debouncedFn && typeof debouncedFn.cancel === 'function') {
        debouncedFn.cancel();
      }
    });
    debouncedFunctionsRef.current = {};

    // FIX: Also reset loading states when cleaning up
    resetAllLoadingStates();
  }, [resetAllLoadingStates]);

  // Cleanup khi component unmount hoặc khi actions thay đổi
  useMemo(() => {
    return () => cleanupDebouncedFunctions();
  }, [actionsMap, cleanupDebouncedFunctions]);

  // FIX: Enhanced return with loading states
  return {
    actions: mouseEventHandlers,
    loading: loadingStates, // Individual loading states for each action
    isLoading, // Global loading state
  };
};

export { ACTION_TYPES, DEFAULT_TRIGGER, FC_TYPES, useHandleProps };
