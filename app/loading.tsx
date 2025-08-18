'use client';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';

import { getDeviceType } from '@/lib/utils';
import { loadingLayout } from './loadingLayout';

const GridSystemContainer = dynamic(() => import('@/components/grid-systems'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

export default function Loading() {
  const [deviceType, setDeviceType] = useState(getDeviceType());
  const [isDelayComplete, setIsDelayComplete] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setDeviceType(getDeviceType());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Thêm delay để loading hiển thị lâu hơn
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDelayComplete(true);
    }, 30000); // 3 giây - bạn có thể thay đổi thời gian này

    return () => clearTimeout(timer);
  }, []);

  const selectedLoadingLayout = useMemo(
    () =>
      (loadingLayout?.layoutJson && (loadingLayout?.layoutJson as any)[deviceType]) ??
      loadingLayout?.layoutJson ??
      {},
    [loadingLayout, deviceType]
  );

  // Nếu delay chưa hoàn thành hoặc layout rỗng, hiển thị loading
  if (!isDelayComplete || _.isEmpty(selectedLoadingLayout)) {
    return (
      <div className="relative !z-0 h-screen flex items-center justify-center">
        <div>Loading... (Checking UI)</div>
      </div>
    );
  }

  return (
    <div className="relative !z-0 h-screen">
      hihihi
      <GridSystemContainer
        page={selectedLoadingLayout}
        deviceType={deviceType}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}