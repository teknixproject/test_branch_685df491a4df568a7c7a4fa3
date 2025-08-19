'use client';

    import LoadingAbout from "./about";

    const component: any = {
    "/about": LoadingAbout
    };

    const LoadingLayoutComponent = ({ pathname }: { pathname: string }) => {
    const Component = component[pathname];
    return <Component />;
    };

    export default LoadingLayoutComponent;