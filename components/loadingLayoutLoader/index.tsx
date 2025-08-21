'use client';

import LoadingDefaultXstudio from "./LoadingDefaultXstudio";
import LoadingStudent from "./student";
import LoadingRoot from "./loadingRoot";
import LoadingAbout from "./about";

const component: any = {
  "/student": LoadingStudent,
  "/": LoadingRoot,
  "/about": LoadingAbout
};

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname]

  return Component ? <Component /> : <LoadingDefaultXstudio />
}

export default LoadingLayoutComponent;