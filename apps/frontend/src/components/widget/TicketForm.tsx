'use client';

import { useForm } from 'react-hook-form';
import container, { TYPES } from '@/infrastructure/Container';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import ModalState from '@/state/Modal.state';

export default function TicketForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const modal = container.get<ModalState>(TYPES.ModalState);

  return (
    <form className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => {
            modal.active('Geo');
          }}
        >
          Включити геолокацію
        </Button>
        <Button type="submit">Відправити</Button>
      </div>
    </form>
  );
}
