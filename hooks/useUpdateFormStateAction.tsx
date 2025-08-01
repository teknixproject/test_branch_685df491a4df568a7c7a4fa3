import _ from 'lodash';

import { TAction, TActionUpdateFormState } from '@/types';

import { TActionsProps } from './useActions';
import { THandleDataParams, useHandleData } from './useHandleData';

export type TUseActions = {
  handleUpdateFormStateAction: (
    action: TAction<TActionUpdateFormState>,
    params?: THandleDataParams
  ) => Promise<void>;
};

export const useUpdateFormStateAction = (
  props: TActionsProps,
  params?: THandleDataParams
): TUseActions => {
  const { getData } = useHandleData(props);

  const handleUpdateFormStateAction = async (
    action: TAction<TActionUpdateFormState>
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

  return { handleUpdateFormStateAction };
};
