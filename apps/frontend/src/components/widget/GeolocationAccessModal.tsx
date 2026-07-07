'use client';

import { observer } from 'mobx-react-lite';
import container, { TYPES } from '@/infrastructure/Container';
import { Button } from '../ui/button';
import GetGeoDataLocalRequest from '@/request/GetGeoDataLocal.request';
import ModalState from '@/state/Modal.state';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { TicketState } from '@/state/Ticket.state';

function GeolocationAccessModal() {
  const pathname = usePathname();

  const modalState = container.get<ModalState>(TYPES.ModalState);

  if (!modalState.isActive('Geo') || !pathname.includes('/ticket/create')) {
    return null;
  }

  async function handle() {
    const request = container.get<GetGeoDataLocalRequest>(TYPES.GetGeoData);
    const toastId = toast.loading('Визначаємо ваші координати...');

    try {
      const coords = await request.execute();

      container
        .get<TicketState>(TicketState)
        .chooseLocation({ long: coords.longitude, lat: coords.latitude });

      toast.success('Геолокацію успішно визначено!', { id: toastId });

      modalState.unactive('Geo');
      modalState.active('ticket');
    } catch (error: any) {
      console.error(error);

      toast.error(
        `Не вдалося отримати геопозицію: ${error.message || 'Доступ заборонено'}`,
        {
          id: toastId,
        },
      );

      modalState.unactive('Geo');
      modalState.active('InputStreet');
    }
  }

  function handleDecline() {
    modalState.unactive('Geo');
    modalState.active('InputStreet');
  }

  return (
    <Card className="max-w-120 pointer-events-auto shadow-2xl border-primary/20 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center space-x-2.5">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary shrink-0">
          <MapPin className="w-6 h-6" />
        </div>
        <CardTitle className="text-lg font-semibold text-foreground leading-tight">
          Для спрощення роботи нам потрібна ваша геолокація
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Це допоможе автоматично визначити, звідки надходить скарга. Якщо ви не
          бажаєте вмикати геолокацію, будь ласка, вказуйте вулицю та номер
          будинку в заявах вручну.
        </p>

        <div className="flex w-full gap-3 mt-2">
          <Button variant="outline" className="flex-1" onClick={handleDecline}>
            Відмовитися
          </Button>
          <Button className="flex-1 font-medium" onClick={handle}>
            Погодитися
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Експортуємо обсервер
export default observer(GeolocationAccessModal);
