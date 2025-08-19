'use client';

const component: any = {

}

const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
  const Component = component[pathname]

  return Component ? <Component /> : <div>Loading...</div>
}

export default LoadingLayoutComponent;