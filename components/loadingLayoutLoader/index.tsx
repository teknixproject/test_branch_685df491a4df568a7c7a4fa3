/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import LoadingAbout from "./about";
import LoadingAboutId from "./aboutid";
import LoadingDefaultXstudio from "./LoadingDefaultXstudio";
import LoadingRemove from "./LoadingRemove";
import LoadingRoot from "./loadingRoot";
import LoadingStudent from "./student";
import LoadingSubject from "./subject";

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {

  const findMatchingRoute = (pathname: string) => {

    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '')

    const routes: any = [
      { pattern: '/', component: 'LoadingRoot' },
      { pattern: '/about', component: 'LoadingAbout' },
      { pattern: '/student', component: 'LoadingStudent' },
      { pattern: '/subject', component: 'LoadingSubject' }
    ]

    for (const route of routes) {
      if (route.pattern === normalizedPath) {
        return route.component;
      }
    }

    const segments = normalizedPath.split('/').filter(Boolean);
if (segments[0] === 'about' && segments[1]) {
      return 'LoadingAboutId';
    }

    return 'LoadingDefaultXstudio';
  }

  const componentMap: Record<string, React.ComponentType> = {
    'LoadingRoot': LoadingRoot,
    'LoadingDefaultXstudio': LoadingDefaultXstudio,
    'LoadingAboutId': LoadingAboutId,
    'LoadingRemove': LoadingRemove
  };

  const componentName = findMatchingRoute(pathname);

  const Component = componentMap[componentName] || LoadingDefaultXstudio

  return <Component />
};

export default LoadingLayoutComponent;