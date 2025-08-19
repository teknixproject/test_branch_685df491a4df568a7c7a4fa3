import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import {
  TDocumentState,
  TDocumentStateFind,
  TDocumentStateSet,
  TDocumentStateUpdate,
  TVariable,
} from '@/types';
import { transformVariable } from '@/utils/tranformVariable';

export type TDocumentStateActions = {
  setStateManagement: (variable: TDocumentStateSet) => void;
  findVariable: (data: TDocumentStateFind) => TVariable | undefined;
  updateVariables: (data: TDocumentStateUpdate) => void;
  resetState: () => void;
};

const initValue: TDocumentState = {
  parameters: {},
  componentState: {},
  appState: {},
  globalState: {},
  apiResponse: {},
  dynamicGenerate: {},
};

export const stateManagementStore = create<TDocumentState & TDocumentStateActions>()(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        ...initValue,

        setStateManagement: ({ type, dataUpdate }) => {
          const oldData = get()[type] || {};

          const newData = Object.keys(dataUpdate).reduce(
            (acc, key) => {
              if (!(key in oldData)) {
                acc[key] = dataUpdate[key];
              }
              return acc;
            },
            { ...oldData }
          );

          set(() => ({
            [type]: newData,
          }));
        },

        findVariable: ({ type, id, name }) => {
          const data = get()[type] || {};
          if (id) {
            return {
              ...data[id],
              value: transformVariable(data[id]),
            };
          }
          if (name) {
            return Object.values(data).find((item: TVariable) => item.key === name);
          }
        },

        updateVariables: ({ type, dataUpdate }) => {
          set((state) => ({
            [type]: {
              ...state[type],
              [dataUpdate.id]: dataUpdate,
            },
          }));
          return get()[type];
        },

        resetState() {
          set(initValue);
        },
      }),
      { name: 'stateManagementStore' }
    )
  )
);
