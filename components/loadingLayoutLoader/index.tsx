
'use client';

import LoadingDefaultXstudio from "./LoadingDefaultXstudio";
import LoadingAbout from "./about";

const component: any = {"/about": LoadingAbout};

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname]

  return Component ? <Component /> : <LoadingDefaultXstudio />
}

export default LoadingLayoutComponent;