'use client';
import { usePathname } from 'next/navigation';

import LoadingLayoutComponent from '@/utils/loadingLayoutLoader';

export default function LoadingPage() {
  const pathname = usePathname();

  return (
    <LoadingLayoutComponent pathname={pathname} />
  );
}