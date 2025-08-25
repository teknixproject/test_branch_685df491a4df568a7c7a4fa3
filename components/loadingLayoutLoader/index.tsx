
'use client';

import LoadingAbout from "./about";
import LoadingDefaultXstudio from "./LoadingDefaultXstudio";
import LoadingRemove from "./LoadingRemove"
import LoadingStudent from "./student";
import LoadingSubject from "./subject";

const component: any = {
  "/about": LoadingAbout,
  "/": LoadingRemove,
  "/student": LoadingStudent,
  "/subject": LoadingSubject
};

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname];
  return Component ? <Component /> : <LoadingDefaultXstudio />;
};

export default LoadingLayoutComponent;