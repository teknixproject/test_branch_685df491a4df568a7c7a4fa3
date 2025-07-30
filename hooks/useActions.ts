/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

import {
  TAction,
  TActionApiCall,
  TActionCustomFunction,
  TActionLoop,
  TActionNavigate,
  TActionUpdateFormState,
  TActionUpdateState,
  TConditional,
  TConditionChildMap,
  TTriggerActions,
  TTriggerValue,
} from '@/types';
import { GridItem } from '@/types/gridItem';
import { transformVariable } from '@/uitls/tranformVariable';

import { actionHookSliceStore } from './store/actionSliceStore';
import { useApiCallAction } from './useApiCallAction';
import { useConditionChildAction } from './useConditionChildAction';
import { useCustomFunction } from './useCustomFunction';
import { useLoopActions } from './useLoopActions';
import { useNavigateAction } from './useNavigateAction';
import { useUpdateFormStateAction } from './useUpdateFormStateAction';
import { useUpdateStateAction } from './useUpdateStateAction';

export type TUseActions = {
  handleAction: (
    triggerType: TTriggerValue,
    action?: TTriggerActions,
    formData?: Record<string, any>
  ) => Promise<void>;
  isLoading: boolean;
  executeActionFCType: (action?: TAction) => Promise<void>;
};

export type TActionsProps = {
  data?: GridItem;
  valueStream?: any;
  methods?: UseFormReturn<FieldValues, any, FieldValues>;
};
export const useActions = (props: TActionsProps): TUseActions => {
  const { data, valueStream } = useMemo(() => {
    return props;
  }, [props]);

  const actions = useMemo(() => _.get(data, 'actions') as TTriggerActions, [data]);
  const setMultipleActions = actionHookSliceStore((state) => state.setMultipleActions);
  const findAction = actionHookSliceStore((state) => state.findAction);
  const { handleApiCallAction } = useApiCallAction(props);
  // const { executeConditional } = useConditionAction();
  const { executeConditionalChild } = useConditionChildAction(props);
  const { handleUpdateStateAction } = useUpdateStateAction(props);
  const { handleCustomFunction } = useCustomFunction(props);
  const { handleUpdateFormStateAction } = useUpdateFormStateAction(props);
  const { handleNavigateAction } = useNavigateAction({ data, valueStream });
  const { executeLoopOverList } = useLoopActions();
  const [isLoading, setIsLoading] = useState(false);

  const executeConditional = async (action: TAction<TConditional>) => {
    const conditions = action?.data?.conditions as string[];
    if (_.isEmpty(conditions)) return;
    for (const conditionId of conditions) {
      const condition = findAction(conditionId) as TAction<TConditionChildMap>;

      if (condition) {
        await executeActionFCType(condition);
      }
    }
  };
  const executeActionFCType = async (action?: TAction): Promise<void> => {
    if (!action?.fcType) return;

    switch (action.fcType) {
      case 'action':
        await executeAction(action as TAction<TActionApiCall>);
        break;
      case 'conditional':
        await executeConditional(action as TAction<TConditional>);
        break;
      case 'conditionalChild':
        const isMatch = await executeConditionalChild(action as TAction<TConditionChildMap>);
        console.log('🚀 ~ executeActionFCType ~ isMatch:', isMatch);

        const conditionChildData = action?.data as TConditionChildMap;
        const isReturnValue = (action?.data as TConditionChildMap)?.isReturnValue;
        if (isReturnValue && isMatch) {
          return transformVariable(conditionChildData.valueReturn!);
        }
        if (!isMatch) return;
        break;
      case 'loop':
        await executeLoopOverList(action as TAction<TActionLoop>);
        break;

      default:
        console.error(`Unknown fcType: ${action.fcType}`);
    }
    if (action.next) {
      await executeActionFCType(findAction(action.next));
    }
  };

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const executeAction = async (action: TAction): Promise<void> => {
    if (!action) return;

    try {
      switch (action.type) {
        case 'navigate':
          return await handleNavigateAction(action as TAction<TActionNavigate>);
        case 'apiCall':
          return await handleApiCallAction(action as TAction<TActionApiCall>);
        case 'updateStateManagement':
          return await handleUpdateStateAction(action as TAction<TActionUpdateState>);
        case 'customFunction':
          return await handleCustomFunction(action as TAction<TActionCustomFunction>);
        case 'updateFormState':
          return await handleUpdateFormStateAction(action as TAction<TActionUpdateFormState>);
        default:
          console.error(`Unknown action type: ${action.type}`);
      }
    } catch (error) {
      console.error(`Error executing action ${action.id}:`, error);
    }
  };

  const executeTriggerActions = async (
    triggerActions: TTriggerActions,
    triggerType: TTriggerValue,
    formData?: Record<string, any>
  ): Promise<void> => {
    const triggerValues = triggerActions || data?.action;
    const actionsToExecute = triggerValues[triggerType];

    await setMultipleActions({
      actions: triggerActions,
      triggerName: triggerType,
      formData,
    });
    if (!actionsToExecute) return;

    // Find and execute the root action (parentId === null)
    const rootAction = Object.values(actionsToExecute).find((action) => !action.parentId);
    if (rootAction) {
      if (rootAction.delay) {
        await new Promise((resolve) => setTimeout(resolve, rootAction.delay));
      }
      await executeActionFCType(rootAction);
    }
  };

  const handleAction = useCallback(
    async (
      triggerType: TTriggerValue,
      action?: TTriggerActions,
      formData?: Record<string, any>
    ): Promise<void> => {
      setIsLoading(true);
      try {
        await executeTriggerActions(action || data?.actions || {}, triggerType, formData);
      } finally {
        setIsLoading(false);
      }
    },
    [data?.actions, executeTriggerActions]
  );
  const renderedIdRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (
      mounted.current &&
      data?.id &&
      !renderedIdRef.current.has(data.id) &&
      !_.isEmpty(actions) &&
      'onPageLoad' in actions
    ) {
      renderedIdRef.current.add(data.id);
      handleAction('onPageLoad');
    }
  }, [data?.id, actions]);

  return { handleAction, isLoading, executeActionFCType };
};
export const handleActionExternal = async (
  triggerType: TTriggerValue,
  actions: TTriggerActions = {},
  formData?: Record<string, any>,
  executeTriggerActions?: (
    triggerActions: TTriggerActions,
    triggerType: TTriggerValue,
    formData?: Record<string, any>
  ) => Promise<void>
): Promise<void> => {
  if (typeof executeTriggerActions !== 'function') {
    console.warn('No executeTriggerActions function provided.');
    return;
  }

  try {
    await executeTriggerActions(actions, triggerType, formData);
  } catch (error) {
    console.error('Error while executing trigger actions:', error);
  }
};
