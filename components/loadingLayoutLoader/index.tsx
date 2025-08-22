/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import LoadingAbout from "./about";
import LoadingDefaultXstudio from "./LoadingDefaultXstudio";
import LoadingRemove from "./LoadingRemove"
import LoadingRoot from "./loadingRoot";
import LoadingStudent from "./student";

const component: any = {
  "/about": LoadingAbout,
  "/": LoadingRoot,
  "/student": LoadingStudent
};

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname];
  return Component ? <Component /> : <LoadingDefaultXstudio />;
};

export default LoadingLayoutComponent;