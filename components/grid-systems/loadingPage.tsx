'use client';
import { usePathname } from 'next/navigation';

import LoadingLayoutComponent from '@/components/loadingLayoutLoader';

export default function LoadingPage() {
  const pathname = usePathname();

  return (
    <LoadingLayoutComponent pathname={pathname} />
  );
}