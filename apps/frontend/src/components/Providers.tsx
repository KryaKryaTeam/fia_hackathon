'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PublicEnvScript } from 'next-runtime-env';
import { PropsWithChildren } from 'react';

function Providers({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {' '}
      <PublicEnvScript />
      {children}
    </QueryClientProvider>
  );
}

export default Providers;
