'use client';

import LoadingRoot from "./loadingRoot";

const component: any = {
  '/': LoadingRoot,
}

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname]

  return Component ? <Component /> : <LoadingRoot />
}

export default LoadingLayoutComponent;