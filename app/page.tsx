import EntryPage from '@/components/page/EntryPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  console.log('Hihihaha 123 123');

  return <EntryPage />;
}
