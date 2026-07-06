'use client';

import { observer } from 'mobx-react-lite';
// import { useForm } from 'react-hook-form';
import container, { TYPES } from '@/infrastructure/Container';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import ModalState from '@/state/Modal.state';
import { Send } from 'lucide-react';

function TicketForm() {
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<TicketFormValues>({
  //   defaultValues: { name: '', phone: '', description: '' },
  // });

  const modal = container.get<ModalState>(TYPES.ModalState);
  if (!modal.isActive('ticket')) return null;

  // function onSubmit(data: TicketFormValues) {
  //   // TODO: тут виклик NetworkRequest.execute(data) через контейнер
  // }

  return (
    <section className="w-full max-w-300 rounded-lg flex flex-row gap-2 h-max bg-background p-2">
      <Input placeholder="Опишіть проблему" className="h-12"></Input>
      <Button className="h-12 w-12">
        <Send />
      </Button>
    </section>
  );
}

export default observer(TicketForm);
