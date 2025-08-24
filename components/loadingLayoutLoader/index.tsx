'use client';

import LoadingDefaultXstudio from './LoadingDefaultXstudio';

const component: any = {
}

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname];

  // return Component ? <Component /> : <LoadingDefaultXstudio />
  return Component ? <Component /> : <div className="">Loading...</div>
}

export default LoadingLayoutComponent;
