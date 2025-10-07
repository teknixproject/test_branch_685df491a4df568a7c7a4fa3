import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { TAction, TTriggerActions, TTriggerValue } from '@/types';

type TState = {
  actions: {
    [key: string]: TTriggerActions;
  };
  triggerName: TTriggerValue;
  formData: any;
  valueStream: any;
};

export type TActionHookActions = {
  setTriggerName: (triggerName: TTriggerValue) => void;
  addTriggerFull: (data: { triggerFull: TTriggerActions; nodeId: string }) => void;
  setMultipleActions: (data: {
    triggerName?: TTriggerValue;
    actions: TState['actions'];
  }) => Promise<void>;
  getFormData: () => any;
  findAction: ({ nodeId, actionId }: { nodeId: string; actionId: string }) => TAction | undefined;
  setFormData: (formData: any) => void;
  setValueStream: (valueStream: any) => void;
  findTriggerFullByNodeId: (nodeId: string) => TTriggerActions | undefined;
  reset: () => void;
};

export const actionHookSliceStore = create<TState & TActionHookActions>()(
  devtools(
    (set, get) => ({
      actions: {},
      triggerName: 'onClick',
      formData: null,

      setTriggerName: (triggerName) => {
        set({ triggerName }, false, 'actionHook/setTriggerName');
      },

      setFormData: (formData) => {
        set({ formData }, false, 'actionHook/setFormData');
      },

      addTriggerFull: (data) => {
        set(
          (state) => ({
            ...state,
            actions: { [data.nodeId]: data.triggerFull },
          }),
          false,
          'actionHook/addTriggerFull'
        );
      },
      setMultipleActions(data) {
        set(
          (state) => ({
            ...state,
            actions: { ...state.actions, ...data.actions },
            triggerName: data.triggerName ?? state.triggerName,
          }),
          false,
          'actionHook/setMultipleActions'
        );
      },

      setValueStream: (valueStream) => {
        set({ valueStream }, false, 'actionHook/setvalueStream');
      },
      findAction: ({ nodeId, actionId }) => {
        const trigger = get().triggerName;
        const action = get().actions?.[nodeId]?.[trigger]?.data?.[actionId];
        return action || undefined;
      },

      getFormData: () => {
        const data = get().formData;
        return data;
      },
      findTriggerFullByNodeId(nodeId) {
        return get().actions?.[nodeId];
      },

      reset: () => {
        set(
          {
            actions: {},
            triggerName: 'onClick',
            formData: null,
          },
          false,
          'actionHook/reset'
        );
      },
    }),
    {
      name: 'actionHookSliceStore', // Hiện tên trong Redux DevTools
    }
  )
);
