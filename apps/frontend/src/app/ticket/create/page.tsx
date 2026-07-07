'use client';
import Orb from '@/components/Orb';
import TicketForm from '@/components/widget/TicketForm';
import container, { TYPES } from '@/infrastructure/Container';
import ModalState from '@/state/Modal.state';
import { UserState } from '@/state/User.state';
import { LucideMessageCircleWarning } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function TicketPage() {
  const modal = container.get<ModalState>(TYPES.ModalState);
  const user = container.get<UserState>(TYPES.UserState);

  const [ShowAlert, setShowAlert] = useState(false);
  useEffect(() => {
    const tm = setTimeout(() => {
      setShowAlert(true);
    }, 1500);

    return () => {
      clearTimeout(tm);
    };
  }, []);
  modal.active('Geo');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-black font-heading">Щось турбує?</h1>
      <div className="absolute my-auto -right-100 blur-3xl w-200 h-screen bg-primary rounded-full opacity-10 -z-20"></div>
      <div className="absolute my-auto -left-100 blur-3xl w-200 h-screen bg-primary rounded-full opacity-10 -z-20"></div>
      <div className="relative w-200 h-200 max-md:w-90 max-md:h-90 max-md:py-10">
        <Orb
          hue={283}
          hoverIntensity={0}
          rotateOnHover={false}
          forceHoverState={false}
        />
      </div>
      {user.isAuthorized ? (
        <TicketForm />
      ) : (
        <div className="w-full p-5 flex items-center justify-center">
          Авторизуйтесь будь-ласка
        </div>
      )}
      {user.isAuthorized && !user.User?.isProfileFull && ShowAlert ? (
        <div className="mt-5 max-w-296 h-max max-md:max-w-90 w-full bg-primary/5 border-2 border-primary/10 flex flex-row items-center justify-center space-x-5 p-2">
          <LucideMessageCircleWarning className="h-8 w-8 max-md:hidden" />
          <p className="text-xs">
            У вас не заповненні додаткові дані, тож в заявах дані про вас можуть
            буди не точними.{' '}
            <Link href={'/user/changeData'} className="underline">
              Їх можна заповнити тут
            </Link>
          </p>
        </div>
      ) : null}
    </div>
  );
}
export default observer(TicketPage);
