import { GridItem } from '@/types/gridItem';

export const getPropData = (data: GridItem) =>
  data?.componentProps?.dataProps?.filter((item: any) => item.type === 'data');
