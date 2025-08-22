
'use client';

import LoadingDefaultXstudio from "./LoadingDefaultXstudio";

import LoadingRemove from "./LoadingRemove";

const component: any = {
  "/": LoadingRemove
};

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname];
  return Component ? <Component /> : <LoadingDefaultXstudio />;
};

export default LoadingLayoutComponent;