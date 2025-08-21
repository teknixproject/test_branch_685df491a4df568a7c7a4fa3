
'use client';

import LoadingDefaultXstudio from "./LoadingDefaultXstudio";
import LoadingRoot from "./loadingRoot";

const component: any = {"/about": LoadingRemove,
  "/": LoadingRoot};

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname]

  return Component ? <Component /> : <LoadingDefaultXstudio />
}

export default LoadingLayoutComponent;