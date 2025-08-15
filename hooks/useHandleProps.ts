import _ from 'lodash';
import { useCallback, useMemo, useRef, useState } from 'react';
import { FieldValues, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { useDeepCompareMemo } from 'use-deep-compare';

import { TAction, TTriggerActions, TTriggerValue } from '@/types';
import { GridItem } from '@/types/gridItem';

import { useActions } from './useActions';

interface TDataProps {
  name: string;
  type: 'data' | 'MouseEventHandler';
  data: TTriggerActions;
}

interface UseHandlePropsResult {
  actions: Record<string, React.MouseEventHandler<HTMLButtonElement>>;
  loading: Record<string, boolean>; // FIX: Thêm loading state
  isLoading: boolean; // FIX: Global loading state
}

interface UseHandlePropsProps {
  dataProps: TDataProps[];
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

const createActionsMap = (dataProps: TDataProps[]): Record<string, TTriggerActions> => {
  const map: Record<string, TTriggerActions> = {};

  dataProps?.forEach((item) => {
    if (!_.isEmpty(item.data)) {
      map[item.name] = item.data;
    }
  });

  return map;
};

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

  // FIX: Add loading states
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Store references for debounced functions
  const debouncedFunctionsRef = useRef<Record<string, any>>({});

  // Step 1: Tạo actions map từ dataProps
  const actionsMap = useMemo(() => {
    return createActionsMap(dataProps);
  }, [dataProps]);

  // Step 2: Lấy executeTriggerActions từ useActions hook
  const { executeTriggerActions } = useActions(props);

  // FIX: Helper functions for loading state management
  const setActionLoading = useCallback((actionName: string, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [actionName]: loading,
    }));
  }, []);

  const resetAllLoadingStates = useCallback(() => {
    setLoadingStates({});
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
  const mouseEventHandlers = useDeepCompareMemo(() => {
    if (!Array.isArray(dataProps)) return {};

    const validActions = dataProps.filter((item) => !_.isEmpty(item.data?.onClick));
    const result: Record<string, React.MouseEventHandler<HTMLButtonElement>> = {};

    for (const item of validActions) {
      const rootAction = findRootAction(item.data?.onClick || {});
      const actionMap = actionsMap[item.name];

      if (!actionMap) continue;

      // Tạo execute handler
      const executeHandler = createExecuteHandler(actionMap, item.name);

      // Kiểm tra xem có cần debounce không
      if (rootAction?.delay && rootAction.delay > 0) {
        // Kiểm tra xem đã có debounced function cho item này chưa
        const cacheKey = `${item.name}_${rootAction.delay}`;

        if (!debouncedFunctionsRef.current[cacheKey]) {
          // FIX: Enhanced debounced function with loading state
          const debouncedHandler = _.debounce(async (...args: any[]) => {
            await executeHandler(...args);
          }, rootAction.delay);

          // FIX: Wrap debounced function to handle loading state properly
          debouncedFunctionsRef.current[cacheKey] = async (...args: any[]) => {
            // Set loading immediately when debounced function is called
            setActionLoading(item.name, true);

            try {
              await debouncedHandler(...args);
            } catch (error) {
              console.error(`Error in debounced action ${item.name}:`, error);
              // Clear loading state if there's an error
              setActionLoading(item.name, false);
            }
            // Note: loading state will be cleared by the actual executeHandler
          };
        }

        result[item.name] = debouncedFunctionsRef.current[cacheKey];
      } else {
        result[item.name] = executeHandler;
      }
    }

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
