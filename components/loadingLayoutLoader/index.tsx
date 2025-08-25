/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import LoadingAboutId from "./aboutid";
import LoadingDefaultXstudio from "./LoadingDefaultXstudio";
import LoadingRemove from "./LoadingRemove";
import LoadingStudent from "./student";
import LoadingStudentId from "./studentid";

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {

  const findMatchingRoute = (pathname: string) => {

    const normalizedPath = pathname === '/' ? '/' : pathname.replace(//$/, '')

    const routes: any = [
      { pattern: '/student', component: 'LoadingStudent' }

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
    if (segments[0] === 'student' && segments[1]) {
      return 'LoadingStudentId';
    }

    return 'LoadingDefaultXstudio';
  }

  const componentMap: Record<string, React.ComponentType> = {
    'LoadingDefaultXstudio': LoadingDefaultXstudio,
    'LoadingRemove': LoadingRemove,
    'LoadingAboutId': LoadingAboutId,
    'LoadingStudent': LoadingStudent,
    'LoadingStudentId': LoadingStudentId,
    'LoadingRoot': LoadingRemove
  };

  const componentName = findMatchingRoute(pathname);

  const Component = componentMap[componentName] || LoadingDefaultXstudio

  return <Component />
};

export default LoadingLayoutComponent;