
'use client';

import LoadingDefaultXstudio from "./LoadingDefaultXstudio";
import LoadingStudent from "./student";
import LoadingRoot from "./loadingRoot";

const component: any = {}


const component: any = {
  "/student": LoadingStudent,
  "/": LoadingRoot
};

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname]

  return Component ? <Component /> : <LoadingDefaultXstudio />
}

export default LoadingLayoutComponent;