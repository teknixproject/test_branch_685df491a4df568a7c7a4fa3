'use client';

import LoadingRemove from "./LoadingRemove"
import LoadingDefaultXstudio from "./LoadingDefaultXstudio";

const component: any = {}

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname]

  return Component ? <Component /> : <LoadingDefaultXstudio />
}

export default LoadingLayoutComponent;