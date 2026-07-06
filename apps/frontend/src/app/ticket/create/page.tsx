'use client';
import Orb from '@/components/Orb';
import TicketForm from '@/components/widget/TicketForm';
import container, { TYPES } from '@/infrastructure/Container';
import ModalState from '@/state/Modal.state';

export default function TicketPage() {
  const modal = container.get<ModalState>(TYPES.ModalState);
  modal.active('Geo');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-black font-heading">Щось турбує?</h1>
      <div className="absolute my-auto -right-100 blur-3xl w-200 h-screen bg-primary rounded-full opacity-10"></div>
      <div className="absolute my-auto -left-100 blur-3xl w-200 h-screen bg-primary rounded-full opacity-10"></div>
      <div className="relative w-200 h-200">
        <Orb
          hue={283}
          hoverIntensity={0}
          rotateOnHover={false}
          forceHoverState={false}
        />
      </div>

      <TicketForm />
    </div>
  );
}
