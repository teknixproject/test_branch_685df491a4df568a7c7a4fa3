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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setDeviceType(getDeviceType());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectedLoadingLayout = useMemo(
    () =>
      (loadingLayout?.layoutJson && (loadingLayout?.layoutJson as any)[deviceType]) ??
      loadingLayout?.layoutJson ??
      {},
    [loadingLayout, deviceType]
  );

  if (_.isEmpty(selectedLoadingLayout)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative !z-0 h-screen">
      <GridSystemContainer
        page={selectedLoadingLayout}
        deviceType={deviceType}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
