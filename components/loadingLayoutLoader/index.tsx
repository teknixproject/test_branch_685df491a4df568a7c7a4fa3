'use client';

import LoadingRoot from "./loadingRoot";
import LoadingAbout from "./about";
import LoadingStudent from "./student";
import LoadingDefaultXstudio from "./LoadingDefaultXstudio";

const component: any = {
  "/": LoadingRoot,
  "/about": LoadingAbout,
  "/student": LoadingStudent
};

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname]

  return Component ? <Component /> : <LoadingDefaultXstudio />
}

export default LoadingLayoutComponent;