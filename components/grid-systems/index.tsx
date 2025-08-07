/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { FC } from 'react';

import { GridItem } from '@/types/gridItem';

import RenderSliceItem from './RenderSliceItem';
import { GridSystemProps } from './types';

// const componentHasAction = ['pagination', 'button', 'input_text'];
// const componentHasMenu = ['dropdown'];
// const allowUpdateTitle = ['content'];

type TRenderSlice = {
  slice: GridItem | null | undefined;
  idParent?: string;
  isMenu?: boolean;
};

// Define common props interface that all components should accept
interface ComponentProps {
  id?: string;
  style?: React.CSSProperties;
  data?: GridItem;
  childs?: GridItem[];
  styleDevice?: string;
  pathname?: string;
  className?: string;
  [key: string]: any; // Allow additional props
}

//#region Grid System
const GridSystemContainer: FC<GridSystemProps> = ({ page }) => {
  if (!page?.childs) return;
  return <RenderSliceItem data={page} key={page.id} />;
};

export default GridSystemContainer;
