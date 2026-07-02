'use client';

import dynamic from 'next/dynamic';

const BaseMap = dynamic(() => import('@/components/map/Basemap'), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8 mb-12">
      <div className="w-full h-140 bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
    </div>
  ),
});

export default function Page() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <BaseMap />
    </main>
  );
}
