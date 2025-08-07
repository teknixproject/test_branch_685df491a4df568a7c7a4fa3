/* eslint-disable @typescript-eslint/no-unused-vars */
import _ from 'lodash';

import { TAction, TActionFormState } from '@/types';

import { TActionsProps } from './useActions';
import { THandleDataParams, useHandleData } from './useHandleData';

export type TUseActions = {
  handleFormState: (action: TAction<TActionFormState>, params?: THandleDataParams) => Promise<void>;
};

export const useFormStateAction = (props: TActionsProps): TUseActions => {
  const { getData } = useHandleData(props);

  const handleUpdate = async (
    action: TAction<TActionFormState>,
    params?: THandleDataParams
  ): Promise<void> => {
    const { methods } = props;
    if (!methods) return;
    const { setValue } = methods;
    const updates = action?.data?.update;

    if (_.isEmpty(updates)) return;

    for (const item of updates || []) {
      const { name, value } = item;
      const valueState = await getData(value, params);

      setValue(name, valueState);
    }
  };
  const handleUsregister = async (
    action: TAction<TActionFormState>,
    params?: THandleDataParams
  ): Promise<void> => {
    const { methods } = props;
    if (!methods) return;
    const { unregister } = methods;
    const unregisters = action?.data?.unregister;
    for (const item of unregisters || []) {
      const { name } = item;
      unregister(name);
    }
  };
  const handleReset = async (
    action: TAction<TActionFormState>,
    params?: THandleDataParams
  ): Promise<void> => {
    const { methods } = props;
    if (!methods) return;
    const { reset } = methods;
    const resetValue = await getData(action?.data?.reset?.value, params);
    reset(resetValue);
  };
  const handleFormState = async (action: TAction<TActionFormState>, params?: THandleDataParams) => {
    const option = action?.data?.option;
    switch (option) {
      case 'update':
        await handleUpdate(action, params);
        break;

      case 'unregister':
        await handleUsregister(action, params);
        break;
      case 'reset':
        await handleReset(action, params);
        break;
    }
  };

  return { handleFormState };
};
