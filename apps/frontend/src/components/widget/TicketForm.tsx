'use client';

import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import container, { TYPES } from '@/infrastructure/Container';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import ModalState from '@/state/Modal.state';
import { Ticket, MapPin } from 'lucide-react';

interface TicketFormValues {
  name: string;
  phone: string;
  description: string;
}

function TicketForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TicketFormValues>({
    defaultValues: { name: '', phone: '', description: '' },
  });

  const modal = container.get<ModalState>(TYPES.ModalState);
  if (!modal.isActive('ticket')) return null;

  function onSubmit(data: TicketFormValues) {
    // TODO: тут виклик NetworkRequest.execute(data) через контейнер
  }

  return (
    <Card className="w-full max-w-2xl pointer-events-auto">
      <CardHeader className="flex flex-row items-center space-x-2.5">
        <div className="flex items-center justify-center w-12 h-10 bg-primary/10 text-primary">
          <Ticket />
        </div>
        <CardTitle className="text-lg font-semibold text-foreground">
          Нова заявка
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ім&apos;я</Label>
              <Input
                id="name"
                placeholder="Введіть ім'я"
                {...register('name', { required: "Вкажіть ім'я" })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Номер телефону</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+380 XX XXX XX XX"
                {...register('phone', {
                  required: 'Вкажіть номер телефону',
                  pattern: {
                    value: /^\+?\d{9,15}$/,
                    message: 'Некоректний номер',
                  },
                })}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="description">Опис заявки</Label>
            <Textarea
              id="description"
              placeholder="Опишіть проблему..."
              className="min-h-[280px] resize-none"
              {...register('description', { required: 'Опишіть проблему' })}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => modal.active('Geo')}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Включити геолокацію
            </Button>
            <Button type="submit">Відправити заявку</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default observer(TicketForm);
