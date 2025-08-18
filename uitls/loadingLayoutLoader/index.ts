// utils/loadingLayoutLoader.ts
export const loadingLayouts = {
  // Root layout
  '/': () => import('@/app/loadingLayout'),

  // Route specific layouts
  '/about': () => import('@/app/about/loadingLayout'),

  // Add more routes as needed...
};

export async function getLoadingLayoutForRoute(pathname: string) {
  console.log('pathname', pathname);

  try {
    // Thử exact match trước
    if (loadingLayouts[pathname]) {
      const layout = await loadingLayouts[pathname]();
      return layout.loadingLayout || layout.default;
    }

    // Nếu không có exact match, thử với base route (first segment)
    const baseRoute = '/' + pathname.split('/')[1];
    if (loadingLayouts[baseRoute]) {
      const layout = await loadingLayouts[baseRoute]();
      return layout.loadingLayout || layout.default;
    }

    // Fallback to root layout
    const defaultLayout = await loadingLayouts['/']();
    return defaultLayout.loadingLayout || defaultLayout.default;
  } catch (error) {
    console.error('Error loading layout for route:', pathname, error);

    // Final fallback - return empty layout
    return {};
  }
}
