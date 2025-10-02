import { TTriggerActionValue } from '@/types';

export const findActionInTriggerFull = ({
  triggerActive,
  actionId,
}: {
  triggerActive: TTriggerActionValue | null;
  actionId: string;
}) => {
  const action = triggerActive?.data?.[actionId];
  return action;
};
