'use client';

import LoadingRoot from "./loadingRoot";
import LoadingAbout from "./about";

const component: any = {
  "/": LoadingRoot,
  "/about": LoadingAbout
};

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname]

  return Component ? <Component /> : <div>Loading...</div>
}

export default LoadingLayoutComponent;