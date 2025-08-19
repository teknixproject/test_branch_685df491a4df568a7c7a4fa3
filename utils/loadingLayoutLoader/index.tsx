'use client';

import LoadingRoot from "./loadingRoot";
const component: any = {}


const component: any = {
  "/": LoadingRoot
};

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname]

  return Component ? <Component /> : <div>Loading...</div>
}

export default LoadingLayoutComponent;