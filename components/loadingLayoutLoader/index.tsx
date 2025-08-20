'use client';

import LoadingDefaultXstudio from "./LoadingDefaultXstudio";
import LoadingStudent from "./student";

const component: any = {
  "/student": LoadingStudent
};

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname]

  return Component ? <Component /> : <LoadingDefaultXstudio />
}

export default LoadingLayoutComponent;