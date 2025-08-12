export const fetchMetadata = async (path: string) => {
  if (!path) {
    console.warn('Path is undefined or empty, skipping fetchMetadata');
    return {
      data: {
        form: {
          title: { default: 'NextJS PAGE' },
          description: 'Default NextJS Page',
          icon: {
            icon: '',
            apple: '',
            shortcut: '',
          },
        },
      },
    };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

    if (!apiUrl || !projectId) {
      console.error('Missing required environment variables');
      return null;
    }

    const url = `${apiUrl}/api/seo-metadata?projectId=${projectId}&uid=${encodeURIComponent(path)}`;

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'X-Branch': process.env.NEXT_PUBLIC_BRANCH as string,
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    });

    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status}`);
      return null;
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
};
