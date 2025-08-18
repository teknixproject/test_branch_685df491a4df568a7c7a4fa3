// components/AppLoadingWrapper.tsx
'use client';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { getDeviceType } from '@/lib/utils';
import { getLoadingLayoutForRoute } from '@/uitls/loadingLayoutLoader';

const GridSystemContainer = dynamic(() => import('@/components/grid-systems'), {
    loading: () => <div>Loading...</div>,
    ssr: false,
});

interface AppLoadingWrapperProps {
    children: React.ReactNode;
}

export default function AppLoadingWrapper({ children }: AppLoadingWrapperProps) {
    const [deviceType, setDeviceType] = useState(getDeviceType());
    const [isAppReady, setIsAppReady] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [loadingLayout, setLoadingLayout] = useState<any>(null);
    const [layoutLoading, setLayoutLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const handleResize = () => setDeviceType(getDeviceType());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Load loading layout based on current route
    useEffect(() => {
        const loadLayoutForRoute = async () => {
            setLayoutLoading(true);
            try {
                const layout = await getLoadingLayoutForRoute(pathname);
                setLoadingLayout(layout);
            } catch (error) {
                console.error('Error loading layout:', error);
                setLoadingLayout({});
            } finally {
                setLayoutLoading(false);
            }
        };

        loadLayoutForRoute();
    }, [pathname]);

    // Simulate app initialization
    useEffect(() => {
        if (layoutLoading) return; // Đợi layout load xong

        const initApp = async () => {
            // Simulate loading time - thay đổi thời gian này để test UI
            await new Promise(resolve => setTimeout(resolve, 3000)); // 3 giây

            // Có thể thêm logic khởi tạo app thực tế ở đây:
            // - Load user data
            // - Initialize services  
            // - Check authentication
            // - Load app config

            setIsAppReady(true);

            // Delay thêm một chút để hiển thị transition smooth
            setTimeout(() => {
                setIsInitialLoading(false);
            }, 500);
        };

        initApp();
    }, [layoutLoading]);

    const selectedLoadingLayout = useMemo(
        () => {
            if (!loadingLayout) return {};

            return (loadingLayout?.layoutJson && (loadingLayout?.layoutJson as any)[deviceType]) ??
                loadingLayout?.layoutJson ??
                {};
        },
        [loadingLayout, deviceType]
    );

    // Hiển thị loading screen
    if (isInitialLoading || layoutLoading) {
        if (_.isEmpty(selectedLoadingLayout) && !layoutLoading) {
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-lg">Đang tải ứng dụng...</p>
                        <p className="text-sm text-gray-600 mt-2">Route: {pathname}</p>
                    </div>
                </div>
            );
        }

        // Hiển thị fallback loading nếu đang load layout
        if (layoutLoading) {
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                    <div className="text-center text-white">
                        <div className="animate-pulse text-xl mb-4">Loading layout...</div>
                        <p className="text-sm opacity-70">Route: {pathname}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="fixed inset-0 z-50 bg-white">
                <div className="relative !z-0 h-screen">
                    <GridSystemContainer
                        page={selectedLoadingLayout}
                        deviceType={deviceType}
                        style={{ width: '100%', height: '100%' }}
                    />

                    {/* Route indicator cho debugging */}
                    <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-sm">
                        <div>Route: {pathname}</div>
                        <div>Layout: {loadingLayout?.name || 'Default'}</div>
                    </div>

                    {/* Optional: Progress indicator */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                        <div className="text-center text-white">
                            <div className="w-64 h-2 bg-white bg-opacity-30 rounded-full mb-2">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: isAppReady ? '100%' : '70%' }}
                                ></div>
                            </div>
                            <p className="text-sm opacity-80">Đang khởi tạo...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Hiển thị app chính
    return <>{children}</>;
}