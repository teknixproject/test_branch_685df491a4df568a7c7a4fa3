/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import LoadingAboutId from "./aboutid";
import LoadingDefaultXstudio from "./LoadingDefaultXstudio";
import LoadingRemove from "./LoadingRemove";
import LoadingRoot from "./loadingRoot";

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {

  const findMatchingRoute = (pathname: string) => {

    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '')

    const routes: any = [
      { pattern: '/', component: 'LoadingRoot' }
    ]

    for (const route of routes) {
      if (route.pattern === normalizedPath) {
        return route.component;
      }
    }

    const segments = normalizedPath.split('/').filter(Boolean);

    return 'LoadingDefaultXstudio';
  }

  const componentMap: Record<string, React.ComponentType> = {
    'LoadingRoot': LoadingRoot,
    'LoadingDefaultXstudio': LoadingDefaultXstudio,
    'LoadingRemove': LoadingRemove
  };

  const componentName = findMatchingRoute(pathname);

  const Component = componentMap[componentName] || LoadingDefaultXstudio

  return <Component />
};

export default LoadingLayoutComponent;