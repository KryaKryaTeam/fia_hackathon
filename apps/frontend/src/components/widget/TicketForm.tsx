'use client';

import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import { Send } from 'lucide-react';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRequestMutation } from '@/lib/useRequestMutation';
import { CreateApplicationRequest } from '@/request/CreateApplication.request';
import container from '@/infrastructure/Container';
import { TicketState } from '@/state/Ticket.state';
import { CurrentApplicationState } from '@/state/CurrentApplication.state';
import { useRouter } from 'next/navigation';

const schema = z.object({
  text: z
    .string()
    .min(3, { error: 'Прохання має бути довше 3 символів' })
    .max(500, { error: 'Прохання має бути коротше 500 символів' }),
});

function TicketForm() {
  const router = useRouter();
  const migration = useRequestMutation(CreateApplicationRequest, {
    onSuccess(data) {
      const cur_app = container.get(CurrentApplicationState);
      cur_app.setCurrentApplication(data);

      router.push('/ticket/active');
    },
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    const ticSt = container.get(TicketState);
    await migration.mutateAsync({
      text: data.text,
      locationType: ticSt.locationType,
      location: ticSt.location,
      address: ticSt.address,
    });
  }

  return (
    <form
      className="w-full max-w-300 h-max flex flex-col max-md:max-w-90"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <section className="w-full max-w-300 rounded-lg flex flex-row gap-2 h-max bg-background p-2">
        <Input
          placeholder="Опишіть проблему"
          className="h-12"
          {...form.register('text')}
        ></Input>
        <Button className="h-12 w-12" disabled={!form.formState.isValid}>
          <Send />
        </Button>
      </section>
      <p className="text-red-400 text-xs">
        {form.formState.errors.text?.message}
        {form.formState.errors.root?.message}
      </p>
    </form>
  );
}

export default observer(TicketForm);
