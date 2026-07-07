'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import container, { TYPES } from '@/infrastructure/Container';
import { UserState } from '@/state/User.state';
import { Skeleton } from '@/components/ui/skeleton';

function Layout({ children }: { children: React.ReactNode }) {
  const userState = container.get<UserState>(TYPES.UserState);
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (userState.isAuthorized) {
      setIsChecking(false);
      return;
    }

    const timer = setTimeout(() => {
      if (!userState.isAuthorized) {
        router.push('/');
      } else {
        setIsChecking(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [userState.isAuthorized, router]);

  if (isChecking && !userState.isAuthorized) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center p-10 space-y-4"></div>
    );
  }

  return <>{children}</>;
}

export default observer(Layout);
