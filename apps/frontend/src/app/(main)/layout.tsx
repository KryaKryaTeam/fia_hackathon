'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PublicEnvScript } from 'next-runtime-env';

export default function CacheLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <PublicEnvScript />
      {children}
    </QueryClientProvider>
  );
}
