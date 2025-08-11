import _ from 'lodash';
import { useCallback, useMemo, useRef } from 'react';
import { FieldValues, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { useDeepCompareMemo } from 'use-deep-compare';

import { TAction, TTriggerActions, TTriggerValue } from '@/types';
import { GridItem } from '@/types/gridItem';

import { actionHookSliceStore } from './store/actionSliceStore';
import { useActions } from './useActions';

interface TDataProps {
  name: string;
  type: 'data' | 'MouseEventHandler';
  data: TTriggerActions;
}

interface UseHandlePropsResult {
  actions: Record<string, React.MouseEventHandler<HTMLButtonElement>>;
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

  // Store references for debounced functions
  const debouncedFunctionsRef = useRef<Record<string, any>>({});
  const triggerNameRef = useRef<TTriggerValue>(DEFAULT_TRIGGER);
  const previousActionsMapRef = useRef<Record<string, TTriggerActions>>({});

  // Zustand store actions
  const setMultipleActions = actionHookSliceStore((state) => state.setMultipleActions);

  // Step 1: Tạo actions map từ dataProps
  const actionsMap = useMemo(() => {
    return createActionsMap(dataProps);
  }, [dataProps]);

  // Step 2: Lấy executeTriggerActions từ useActions hook
  const { executeTriggerActions } = useActions(props);

  // Step 3: Tạo stable execute function với useCallback
  const createExecuteHandler = useCallback(
    (actionMap: TTriggerActions, itemName: string) => {
      return async (...callbackArgs: any[]) => {
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
      };
    },
    [executeTriggerActions]
  );

  // Step 4: Tạo mouse event handlers với stable debounce
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
          // Tạo debounced function mới và cache lại
          debouncedFunctionsRef.current[cacheKey] = _.debounce(executeHandler, rootAction.delay);
        }

        result[item.name] = debouncedFunctionsRef.current[cacheKey];
      } else {
        result[item.name] = executeHandler;
      }
      result[item.name] = executeHandler;
    }

    return result;
  }, [dataProps, actionsMap, createExecuteHandler]);

  // Cleanup debounced functions when component unmounts or when actions change
  const cleanupDebouncedFunctions = useCallback(() => {
    Object.values(debouncedFunctionsRef.current).forEach((debouncedFn: any) => {
      if (debouncedFn && typeof debouncedFn.cancel === 'function') {
        debouncedFn.cancel();
      }
    });
    debouncedFunctionsRef.current = {};
  }, []);

  // Cleanup khi component unmount hoặc khi actions thay đổi
  useMemo(() => {
    return () => cleanupDebouncedFunctions();
  }, [actionsMap, cleanupDebouncedFunctions]);

  return {
    actions: mouseEventHandlers,
  };
};

export { ACTION_TYPES, DEFAULT_TRIGGER, FC_TYPES, useHandleProps };
