'use client';

import LoadingDefaultXstudio from "./LoadingDefaultXstudio";
import LoadingRoot from "./loadingRoot";
import LoadingAbout from "./about";
import LoadingStudent from "./student";

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