'use client';

import LoadingAbout from "./about";
import LoadingRoot from "./loadingRoot";

const component: any = {
  '/': LoadingRoot,
  '/about': LoadingAbout
}

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname]

  return Component ? <Component /> : <LoadingRoot />
}

export default LoadingLayoutComponent;