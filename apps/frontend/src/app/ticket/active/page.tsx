'use client';

import Silk from '@/components/Silk';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import container from '@/infrastructure/Container';
import { useIsMobile } from '@/lib/useIsMobilde';
import { CurrentApplicationState } from '@/state/CurrentApplication.state';
import { SocketState } from '@/state/Soket.state';
import { DownloadIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function Page() {
  const router = useRouter();
  const cur_app = container.get(CurrentApplicationState);
  const socket = container.get(SocketState);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (!cur_app.isHereCurrent) {
      router.push('/ticket/create');
    }
  }, [cur_app.isHereCurrent, router]);

  useEffect(() => {
    socket.reconnect();

    const currentSocket = socket.socket;

    if (!currentSocket) return;

    currentSocket.once('status_updated', ({ pdf_url }) => {
      setPdfUrl(pdf_url);
      currentSocket.disconnect();
    });

    const handleConnect = () => {
      currentSocket.emit('join_application_room', {
        applicationId: cur_app.currentApplication?.id,
      });
    };

    if (currentSocket.connected) {
      handleConnect();
    } else {
      currentSocket.on('connect', handleConnect);
    }

    return () => {
      currentSocket.off('connect', handleConnect);
      currentSocket.off('status_updated');
      currentSocket.disconnect();
    };
  }, [socket, cur_app.currentApplication?.id]);

  if (!cur_app.isHereCurrent) {
    return null;
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="absolute my-auto -right-100 blur-3xl w-200 h-screen bg-primary rounded-full opacity-10 -z-20"></div>
      <div className="absolute my-auto -left-100 blur-3xl w-200 h-screen bg-primary rounded-full opacity-10 -z-20"></div>
      <Card className="h-100 max-w-200 max-md:max-w-90 w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Заява</CardTitle>
          <p className="text-foreground/70 text-xs font-light">
            {cur_app.currentApplication?.id}
          </p>
        </CardHeader>
        <CardContent className="py-5 grid grid-cols-2 gap-10 grid-rows-1 h-full max-md:grid-cols-1 max-md:">
          <div className="flex flex-col space-y-6 relative">
            <p className="max-w-100">{cur_app.currentApplication?.text}</p>

            <div className="absolute bottom-0 w-full space-y-4">
              {pdfUrl == null ? (
                <Skeleton className="w-full h-15 rounded-lg"></Skeleton>
              ) : (
                <div className="grid grid-cols-[48px_1fr] grid-rows-2 gap-x-4 h-15 items-center">
                  <div className="row-span-2 flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20">
                    <DownloadIcon />
                  </div>

                  <h2 className="text-lg font-medium leading-none">
                    Ваша заява згенерована
                  </h2>
                  <p className="text-xs font-light text-foreground/80 leading-tight">
                    Ви можете її завантажити, натиснувши кнопку нижче
                  </p>
                </div>
              )}
              <div className="flex flex-row space-x-2">
                <Link
                  href="/"
                  onClick={() => cur_app.clearCurrentApplication()}
                  className="flex-1"
                >
                  <Button className="w-full" variant={'secondary'}>
                    На головну
                  </Button>
                </Link>
                {pdfUrl == null ? (
                  <Button className="flex-1">Зачекайте</Button>
                ) : (
                  <Link
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full">Завантажити</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
          {isMobile ? null : (
            <div className="relative overflow-hidden rounded-lg h-full max-md:hidden">
              <Silk
                speed={5}
                scale={1}
                color="#7C3AED"
                noiseIntensity={1.5}
                rotation={0}
              ></Silk>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default observer(Page);
