'use client';

import LoadingDefaultXstudio from "./LoadingDefaultXstudio";
import LoadingRoot from "./loadingRoot";
import LoadingAbout from "./about";

const component: any = {
  }


const component: any = {
  "/": LoadingRoot,
  "/about": LoadingAbout
};

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname]

  return Component ? <Component /> : <LoadingDefaultXstudio />
}

export default LoadingLayoutComponent;