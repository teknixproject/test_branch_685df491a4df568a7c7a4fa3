import _ from 'lodash';

import { TAction, TActionUpdateFormState } from '@/types';

import { TActionsProps } from './useActions';
import { useHandleData } from './useHandleData';

export type TUseActions = {
  handleUpdateFormStateAction: (action: TAction<TActionUpdateFormState>) => Promise<void>;
};

export const useUpdateFormStateAction = (props: TActionsProps): TUseActions => {
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
      const valueState = await getData(value);

      setValue(name, valueState);
    }
  };

  return { handleUpdateFormStateAction };
};
