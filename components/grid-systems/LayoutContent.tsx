'use client';
import _ from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import { useLayoutContext } from '@/context/LayoutContext';
import { getDeviceType } from '@/lib/utils';

import styled from 'styled-components';

const GridSystemContainer = dynamic(() => import('@/components/grid-systems'), {
  ssr: false,
});

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { headerLayout, sidebarLayout, footerLayout, sidebarPosition } = useLayoutContext();
  const [deviceType, setDeviceType] = useState(getDeviceType());
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setDeviceType(getDeviceType());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectedHeaderLayout = useMemo(
    () =>
      (headerLayout?.layoutJson && (headerLayout?.layoutJson as any)[deviceType]) ??
      headerLayout?.layoutJson ??
      {},
    [headerLayout, deviceType]
  );
  const selectedSidebarLayout = useMemo(
    () =>
      (sidebarLayout?.layoutJson && (sidebarLayout?.layoutJson as any)[deviceType]) ??
      sidebarLayout?.layoutJson ??
      {},
    [sidebarLayout, deviceType]
  );
  const selectedFooterLayout = useMemo(
    () =>
      (footerLayout?.layoutJson && (footerLayout?.layoutJson as Record<string, any>)[deviceType]) ??
      footerLayout?.layoutJson ??
      {},
    [footerLayout, deviceType]
  );

  useEffect(() => {
    if (!headerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeaderHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(headerRef.current);

    // Set initial height
    setHeaderHeight(headerRef.current.offsetHeight);

    return () => resizeObserver.disconnect();
  }, [selectedHeaderLayout]);

  const sidebarStyle = useMemo(() => ({
    flexShrink: 0,
    position: 'sticky' as const,
    top: `${headerHeight}px`,
    zIndex: 10,
    maxHeight: `calc(100vh - ${headerHeight}px)`,
    overflow: 'hidden',
  }), [headerHeight]);

  const isSidebarLeft = sidebarPosition === 'left'
  const isSidebarRight = sidebarPosition === 'right'

  const ComponentLayout = FirtLayoutContent

  return (
    <ComponentLayout
      childrenCompo={children}
      deviceType={deviceType}
      headerRef={headerRef}
      isSidebarLeft={isSidebarLeft}
      isSidebarRight={isSidebarRight}
      selectedFooterLayout={selectedFooterLayout}
      selectedHeaderLayout={selectedHeaderLayout}
      selectedSidebarLayout={selectedSidebarLayout}
      sidebarStyle={sidebarStyle}
    />
  )
}

const FirtLayoutContent = ({
  childrenCompo,
  headerRef,
  deviceType,
  isSidebarLeft,
  isSidebarRight,
  sidebarStyle,
  selectedHeaderLayout,
  selectedSidebarLayout,
  selectedFooterLayout,
}: {
  childrenCompo?: any,
  headerRef: any,
  deviceType: any,
  isSidebarLeft: any,
  isSidebarRight: any,
  sidebarStyle: any,
  selectedHeaderLayout: any,
  selectedSidebarLayout: any,
  selectedFooterLayout: any,
}) => {

  return (
    <div className="relative !z-0 h-screen">
      {
        !_.isEmpty(selectedHeaderLayout) && (
          <div id="header" ref={headerRef} className="sticky top-0 z-10 max-h-screen overflow-hidden">
            <GridSystemContainer
              page={selectedHeaderLayout}
              deviceType={deviceType}
              isFooter
              style={{ width: '100%' }}
            />
          </div>
        )
      }
      <div className="z-10 flex">
        {isSidebarLeft && !_.isEmpty(selectedSidebarLayout) && (
          <div id="sidebar" style={{ ...sidebarStyle, overflow: 'auto' }} className="sticky top-0 z-10 max-h-screen">
            <GridSystemContainer
              page={selectedSidebarLayout}
              deviceType={deviceType}
              isHeader
            />
          </div>
        )}
        <Csmain className='h-screen' style={{ flex: 1 }}>
          {childrenCompo}
        </Csmain>
        {isSidebarRight && !_.isEmpty(selectedSidebarLayout) && (
          <div id="sidebar" style={{ ...sidebarStyle }} className="sticky top-0 z-10 max-h-screen overflow-hidden">
            <GridSystemContainer
              page={selectedSidebarLayout}
              deviceType={deviceType}
              isHeader
            />
          </div>
        )}
      </div>
      {
        !_.isEmpty(selectedFooterLayout) && (
          <GridSystemContainer
            page={selectedFooterLayout}
            deviceType={deviceType}
            isFooter
            style={{ width: '100%', height: 'fit-content' }}
          />
        )
      }
    </div >
  );
}

const Csmain = styled.main`
  .ant-app {
    height: 100%;
  }
`