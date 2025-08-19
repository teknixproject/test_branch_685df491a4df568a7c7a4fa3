import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getLoadingLayoutForRoute } from '@/components/loadingLayoutLoader';

export const useLoadingLayout = () => {
  const [loadingLayout, setLoadingLayout] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const loadLayout = async () => {
      setIsLoading(true);
      try {
        const layout = await getLoadingLayoutForRoute(pathname);
        setLoadingLayout(layout);
      } catch (error) {
        console.error('Failed to load layout:', error);
        setLoadingLayout(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadLayout();
  }, [pathname]);

  return { loadingLayout, isLoading };
};
