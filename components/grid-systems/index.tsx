/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { FC } from 'react';

import RenderSliceItem from './RenderSliceItem';
import { GridSystemProps } from './types';

//#region Grid System
const GridSystemContainer: FC<GridSystemProps> = ({ page }) => {
  if (!page?.childs) return;
  return <RenderSliceItem data={page} key={page.id} />;
};

export default GridSystemContainer;
