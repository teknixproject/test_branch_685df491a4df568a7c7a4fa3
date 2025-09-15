import { FC } from 'react';
import { RenderUIClient } from '../grid-systems/ClientWrapGridSystem';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EntryPage: FC = async () => {
  return <RenderUIClient />;
};

export default EntryPage;