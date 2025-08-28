/* eslint-disable react-hooks/exhaustive-deps */
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FieldValues, UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { useDeepCompareEffect } from 'use-deep-compare';

import {
  TAction,
  TActionApiCall,
  TActionCustomFunction,
  TActionFormState,
  TActionLoop,
  TActionMessage,
  TActionNavigate,
  TActionUpdateState,
  TConditional,
  TConditionChildMap,
  TTriggerActions,
  TTriggerValue,
} from '@/types';
import { GridItem } from '@/types/gridItem';
import { transformVariable } from '@/utils/tranformVariable';

import { actionHookSliceStore } from './store/actionSliceStore';
import { useApiCallAction } from './useApiCallAction';
import { useConditionChildAction } from './useConditionChildAction';
import { useCustomFunction } from './useCustomFunction';
import { useFormStateAction } from './useFormStateAction';
import { THandleDataParams } from './useHandleData';
import { useLoopActions } from './useLoopActions';
import { useMessageAction } from './useMessageAction';
import { useNavigateAction } from './useNavigateAction';
import { useUpdateStateAction } from './useUpdateStateAction';

export type TUseActions = {
  handleAction: (
    triggerType: TTriggerValue,
    action?: TTriggerActions,
    params?: THandleDataParams
  ) => Promise<void>;
  isLoading: boolean;
  executeTriggerActions: (
    triggerActions: TTriggerActions,
    triggerType: TTriggerValue,
    params?: THandleDataParams
  ) => Promise<void>;
  executeActionFCType: (action?: TAction) => Promise<void>;
};

export type TActionsProps = {
  data?: GridItem;
  valueStream: any;
  methods?: UseFormReturn<FieldValues, any, FieldValues>;
  methodsArray?: UseFieldArrayReturn<FieldValues, string, 'id'>;
  isCallPageLoad?: boolean;
};

export const useActions = (props: TActionsProps): TUseActions => {
  const { data } = useMemo(() => {
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
  const { handleFormState } = useFormStateAction(props);
  const { handleNavigateAction } = useNavigateAction(props);
  const { executeLoopOverList } = useLoopActions();
  const { executeMessageAction } = useMessageAction(props);
  const [isLoading, setIsLoading] = useState(false);

  const executeConditional = async (action: TAction<TConditional>, params?: THandleDataParams) => {
    const conditions = action?.data?.conditions as string[];
    if (_.isEmpty(conditions)) return;
    for (const conditionId of conditions) {
      const condition = findAction(conditionId) as TAction<TConditionChildMap>;

      if (condition) {
        const isConditionMet = await executeActionFCType(condition, params);
        if (isConditionMet) return;
      }
    }
  };
  const executeActionFCType = async (
    action?: TAction,
    params?: THandleDataParams
  ): Promise<any> => {
    if (!action?.fcType) return;

    switch (action.fcType) {
      case 'action':
        await executeAction(action as TAction<TActionApiCall>, params);
        break;
      case 'conditional':
        await executeConditional(action as TAction<TConditional>, params);
        break;
      case 'conditionalChild':
        const isReturnValue = (action?.data as TConditionChildMap)?.isReturnValue;
        const conditionChildData = action?.data as TConditionChildMap;
        if ((action.data as TConditionChildMap).label === 'else') {
          if (isReturnValue) return transformVariable(conditionChildData.valueReturn!);
          break;
        }
        const isMatch = await executeConditionalChild(
          action as TAction<TConditionChildMap>,
          params
        );
        //if or else if
        if (isReturnValue && isMatch) {
          return transformVariable(conditionChildData.valueReturn!);
        }
        if (!isMatch) return; //prevent call next action
        break;
      case 'loop':
        await executeLoopOverList(action as TAction<TActionLoop>, params);
        break;

      default:
        console.error(`Unknown fcType: ${action.fcType}`);
    }
    if (action.next) {
      await executeActionFCType(findAction(action.next), params);
    }
  };

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const executeAction = async (action: TAction, params?: THandleDataParams): Promise<void> => {
    if (!action) return;
    if (!action.type) return;

    try {
      switch (action.type) {
        case 'navigate':
          return await handleNavigateAction(action as TAction<TActionNavigate>, params);
        case 'apiCall':
          return await handleApiCallAction(action as TAction<TActionApiCall>, params);
        case 'updateStateManagement':
          return await handleUpdateStateAction(action as TAction<TActionUpdateState>, params);
        case 'customFunction':
          return await handleCustomFunction(action as TAction<TActionCustomFunction>, params);
        case 'formState':
          console.log('🚀 ~ executeAction ~ action: form', action);
          return await handleFormState(action as TAction<TActionFormState>, params);
        case 'message':
          return await executeMessageAction(action as TAction<TActionMessage>, params);
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
    params?: THandleDataParams
  ): Promise<void> => {
    const triggerValues = triggerActions || data?.action;
    const actionsToExecute = triggerValues[triggerType];

    await setMultipleActions({
      actions: triggerActions,
      triggerName: triggerType,
    });
    if (!actionsToExecute) return;

    // Find and execute the root action (parentId === null)
    const rootAction = Object.values(actionsToExecute).find((action) => !action.parentId);

    if (rootAction) {
      // if (rootAction?.delay && rootAction?.delay > 0) {
      //   await new Promise((resolve) => setTimeout(resolve, rootAction?.delay));
      // }
      await executeActionFCType(rootAction, params);
    }
  };

  const handleAction = useCallback(
    async (
      triggerType: TTriggerValue,
      action?: TTriggerActions,
      params?: THandleDataParams
    ): Promise<void> => {
      setIsLoading(true);
      try {
        await executeTriggerActions(action || data?.actions || {}, triggerType, params);
      } finally {
        setIsLoading(false);
      }
    },
    [data?.actions, executeTriggerActions]
  );
  const renderedIdRef = useRef<Set<string>>(new Set());

  useDeepCompareEffect(() => {
    if (
      props.isCallPageLoad &&
      mounted.current &&
      data?.id &&
      !renderedIdRef.current.has(data.id) &&
      !_.isEmpty(actions) &&
      'onPageLoad' in actions
    ) {
      renderedIdRef.current.add(data.id);
      handleAction('onPageLoad');
    }
  }, [data?.id, actions, props?.isCallPageLoad]);

  return { handleAction, isLoading, executeTriggerActions, executeActionFCType };
};
export const handleActionExternal = async (
  triggerType: TTriggerValue,
  actions: TTriggerActions = {},
  params: THandleDataParams,
  executeTriggerActions: (
    triggerActions: TTriggerActions,
    triggerType: TTriggerValue,
    params?: THandleDataParams
  ) => Promise<void>
): Promise<void> => {
  if (typeof executeTriggerActions !== 'function') {
    console.warn('No executeTriggerActions function provided.');
    return;
  }

  try {
    await executeTriggerActions(actions, triggerType, params);
  } catch (error) {
    console.error('Error while executing trigger actions:', error);
  }
};
