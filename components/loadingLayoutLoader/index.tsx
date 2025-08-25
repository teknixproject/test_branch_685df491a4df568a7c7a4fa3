
'use client';

import LoadingDefaultXstudio from "./LoadingDefaultXstudio";
import LoadingRemove from "./LoadingRemove";
import LoadingRoot from "./loadingRoot";

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

    return 'LoadingDefaultXstudio';
  }

  const componentMap: Record<string, React.ComponentType> = {
    'LoadingRoot': LoadingRoot,
    'LoadingDefaultXstudio': LoadingDefaultXstudio,
  };

  const componentName = findMatchingRoute(pathname);

  const Component = componentMap[componentName] || LoadingDefaultXstudio

  return <Component />
};

export default LoadingLayoutComponent;