import { GridItem } from '@/types/gridItem';

export interface GridSystemProps {
  page?: GridItem | any;
  layoutId?: string;
  deviceType?: string;
  isHeader?: boolean;
  isBody?: boolean;
  isFooter?: boolean;
  style?: any;
}

export type RenderGripProps = {
  items: GridItem[];
  idParent: string;
  grid?: any;
  slice: GridItem;
};

export type RenderSliceProps = {
  slice: GridItem | null | undefined;
  dataSlice: any;
};

export type MonacoFunctionsProps = {
  slice: GridItem | null | undefined;
};
