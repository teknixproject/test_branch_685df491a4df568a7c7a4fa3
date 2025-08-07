import { headers } from 'next/headers';
import { FC, Suspense } from 'react';
import { RenderUIClient } from '../grid-systems/ClientWrapGridSystem';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EntryPage: FC = async () => {
  const headerList = await headers();
  const pathname = headerList.get('x-path-name');

  if (!pathname) {
    return <div>Error: Pathname not found</div>;
  }

  return (
    <Suspense fallback={<div>Loading UI...</div>}>
      <RenderUIClient />
    </Suspense>
  );
};

export default EntryPage;