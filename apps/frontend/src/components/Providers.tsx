'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PublicEnvScript } from 'next-runtime-env';
import { PropsWithChildren } from 'react';
import { Toaster } from 'sonner';

function Providers({ children }: PropsWithChildren) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <PublicEnvScript />
      {children}
    </QueryClientProvider>
  );
}

export default Providers;
