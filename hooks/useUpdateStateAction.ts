import _ from 'lodash';
import { useEffect, useRef } from 'react';

import { stateManagementStore } from '@/stores';
import { TAction, TActionUpdateState, TTypeSelectState } from '@/types';

import { TActionsProps } from './useActions';
import { THandleDataParams, useHandleData } from './useHandleData';

export type TUseActions = {
  handleUpdateStateAction: (
    action: TAction<TActionUpdateState>,
    params?: THandleDataParams
  ) => Promise<void>;
};

export const useUpdateStateAction = (props: TActionsProps): TUseActions => {
  // State management

  // Store hooks
  const { getData } = useHandleData(props);
  const { findVariable, updateVariables } = stateManagementStore();
  // Memoized actions from data

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  //#region Action Handlers

  const handleUpdateStateAction = async (
    action: TAction<TActionUpdateState>,
    params?: THandleDataParams
  ): Promise<void> => {
    const updates = action?.data?.update;
    console.log('🚀 ~ handleUpdateStateAction ~ updates:', updates);

    if (_.isEmpty(updates)) return;

    for (const item of updates || []) {
      const { firstState, secondState } = item;
      const type = item?.firstState?.type;
      if (!firstState || !secondState || !firstState[type]) continue;
      const variableFirst = findVariable({
        type: type as TTypeSelectState,
        id: (item.firstState[type] as any).variableId || '',
      });

      const variableSecond = await getData(item.secondState, params);
      console.log('🚀 ~ handleUpdateStateAction ~ variableSecond:', variableSecond);

      if (!variableFirst) return;

      variableFirst.value = variableSecond;

      updateVariables({
        type: type as TTypeSelectState,
        dataUpdate: variableFirst,
      });
    }
  };

  return { handleUpdateStateAction };
};
