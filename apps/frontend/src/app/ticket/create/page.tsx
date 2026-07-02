'use client';
import DotField from '@/components/DotField';
import TicketForm from '@/components/widget/TicketForm';
import container, { TYPES } from '@/infrastructure/Container';
import ModalState from '@/state/Modal.state';

export default function TicketPage() {
  const modal = container.get<ModalState>(TYPES.ModalState);
  modal.active('Geo');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div
        style={{ width: '100%', height: '100vh', position: 'absolute' }}
        className="z-[-1]"
      >
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="#A855F7"
          gradientTo="#B497CF"
          glowColor="#120F17"
        />
      </div>
      <h1 className="text-4xl font-bold mb-8">Створення заявки</h1>
      <TicketForm />
    </div>
  );
}
