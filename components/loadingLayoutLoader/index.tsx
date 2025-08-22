/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import LoadingAbout from "./about";
import LoadingDefaultXstudio from "./LoadingDefaultXstudio";
import LoadingRemove from "./LoadingRemove"

const component: any = {
  "/about": LoadingAbout
};

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname];
  return Component ? <Component /> : <LoadingDefaultXstudio />;
};

export default LoadingLayoutComponent;