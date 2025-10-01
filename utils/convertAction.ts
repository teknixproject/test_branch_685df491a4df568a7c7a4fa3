import _ from 'lodash';

import { TTriggerActions } from '@/types';
import { GridItem } from '@/types/gridItem';

const mergeActionProps = (actions: any): TTriggerActions => {
  console.log('🚀 ~ mergeActionProps ~ actions:', actions);
  return Object.entries(actions)
    .filter(([key, action]) => action?.data && !('valueInput' in action?.data))
    .map(([key, action]) => {
      if (!_.isEmpty(action?.data?.onClick)) {
        return {
          ...action,
          data: {
            ...action.data.onClick,
          },
        };
      }
      return action;
    });
};

export const getPropActions = (data: GridItem): TTriggerActions => {
  const dataProps: TTriggerActions = data?.componentProps?.dataProps
    ?.filter((item: any) => item.type.includes('MouseEventHandler'))
    .reduce((acc, item) => ({ ...acc, [item.name]: item }), {});

  //   console.log('🚀 ~ getPropActions ~ dataProps:', dataProps);
  const actions = _.get(data, 'actions', {});
  //   console.log('🚀 ~ getPropActions ~ actions:', actions);
  const componentPropsActions = _.get(data, 'componentProps.actions', {});
  //   console.log('🚀 ~ getPropActions ~ componentPropsActions:', componentPropsActions);
  const result = {
    ...dataProps,
    ...actions,
    ...componentPropsActions,
  };
  console.log('🚀 ~ getPropActions ~ result:', result);
  return result;
};
