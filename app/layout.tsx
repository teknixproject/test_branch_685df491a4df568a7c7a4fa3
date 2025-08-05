import '@ant-design/v5-patch-for-react-19';

import _ from 'lodash';
import { Geist, Geist_Mono } from 'next/font/google';
import { Suspense } from 'react';
import { headers } from 'next/headers';
import { Metadata } from 'next';

import LayoutContent from '@/components/grid-systems/LayoutContent';
import { LayoutProvider } from '@/context/LayoutContext';
import { ApiStoreProvider } from '@/providers';
import AntdProvider from '@/providers/AntdProvider';
import ReactQueryProvider from '@/providers/QueryClient';

import { fetchMetadata } from './actions/server';
import './globals.css';

export const fetchSEOData = async (path: string) => {
  try {
    const response = await fetch(process.env.NEXT_SEO_URL as string, {
      headers: {
        Authorization: process.env.NEXT_AUTHORIZATION as string,
      },
      cache: 'force-cache', // Sử dụng cache để giảm tải
    });
    const data = await response.json();
    return _.find(_.get(data, 'docs'), {
      projectID: process.env.NEXT_SEO_PROJECTID as string,
      path_name: path,
    });
  } catch (err) {
    console.error('Failed to fetch SEO data:', err);
    return null;
  }
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  // Get pathname from headers
  const headersList = await headers();
  const pathname = headersList.get('x-path-name') || 'NextJS';

  const metadata = await fetchMetadata(pathname);
  const formMetadata = _.get(metadata, 'data.form');

  if (!formMetadata) {
    return {
      title: 'NextJS',
      description: 'NextJS 15',
      icons: {
        icon: '',
        shortcut: '',
        apple: '',
      },
    };
  }

  const iconConfig = {
    icon: _.get(formMetadata, 'icon.icon') || '',
    shortcut: _.get(formMetadata, 'icon.shortcut') || '',
    apple: _.get(formMetadata, 'icon.apple') || '',
  };

  return {
    title: {
      default: formMetadata?.title?.default || 'NextJS PAGE',
      template: formMetadata?.title?.template || '%s | NextJS PAGE',
    },
    description: formMetadata?.description || 'Default NextJS Page.',
    keywords: formMetadata?.keywords,
    authors: formMetadata?.authors?.map((author: any) => ({
      name: author.name,
      url: author.url,
    })),
    openGraph: {
      title: formMetadata?.openGraph?.title || formMetadata?.title?.default || 'NEXTJS PAGE',
      description: formMetadata?.openGraph?.description || formMetadata?.description || 'Default NextJS page.',
      url: formMetadata?.openGraph?.url,
      siteName: formMetadata?.openGraph?.siteName,
      images: formMetadata?.openGraph?.images?.map((image: any) => ({
        url: image?.url,
        width: image?.width,
        height: image?.height,
        alt: image?.alt,
        secureUrl: image?.secure_url,
        type: image?.type || 'image/jpeg',
      })),
      locale: formMetadata?.openGraph?.locale || 'en_US',
      type: formMetadata?.openGraph?.type || 'website',
      modifiedTime: formMetadata?.openGraph?.updated_time,
    },
    twitter: {
      card: formMetadata?.twitter?.card || 'summary',
      title: formMetadata?.twitter?.title || formMetadata?.title?.default,
      description: formMetadata?.twitter?.description || formMetadata?.description,
      images: formMetadata?.twitter?.images,
    },
    robots: {
      index: formMetadata?.robots?.index ?? true,
      follow: formMetadata?.robots?.follow ?? true,
      nocache: formMetadata?.robots?.nocache,
      'max-snippet': formMetadata?.robots?.maxSnippet,
      'max-video-preview': formMetadata?.robots?.maxVideoPreview,
      'max-image-preview': formMetadata?.robots?.maxImagePreview,
      googleBot: formMetadata?.robots?.googleBot
        ? {
          index: formMetadata?.robots?.googleBot?.index,
          follow: formMetadata?.robots?.googleBot?.follow,
          noimageindex: formMetadata?.robots?.googleBot?.noimageindex,
        }
        : undefined,
    },
    icons: {
      icon: iconConfig.icon,
      shortcut: iconConfig.shortcut,
      apple: iconConfig.apple,
    },
    alternates: {
      canonical: formMetadata?.alternates?.canonical,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ReactQueryProvider>
          <ApiStoreProvider>
            <LayoutProvider>
              <Suspense>
                <LayoutContent>
                  <AntdProvider>{children}</AntdProvider>
                </LayoutContent>
              </Suspense>
            </LayoutProvider>
          </ApiStoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
