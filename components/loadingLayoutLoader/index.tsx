'use client';

import LoadingRoot from "./loadingRoot";
import LoadingAbout from "./about";

const component: any = {
  '/': LoadingRoot,
}


const component: any = {
  "/about": LoadingAbout
};

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname]

  return Component ? <Component /> : <LoadingRoot />
}

export default LoadingLayoutComponent;