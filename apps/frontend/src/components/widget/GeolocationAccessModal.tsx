'use client';
import { observer } from 'mobx-react-lite';
import container, { TYPES } from '@/infrastructure/Container';
import { Button } from '../ui/button';
import GetGeoDataLocalRequest from '@/request/GetGeoDataLocal.request';
import ModalState from '@/state/Modal.state';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const modalState = container.get<ModalState>(TYPES.ModalState);

function GeolocationAccessModal() {
  const router = useRouter();

  if (!modalState.isActive('Geo')) return null;

  async function handle() {
    const request = container.get<GetGeoDataLocalRequest>(TYPES.GetGeoData);

    try {
      await request.execute();
      modalState.unactive('Geo');
    } catch (error) {
      console.error(error);
      modalState.unactive('Geo');
    }
  }

  function handleDecline() {
    modalState.unactive('Geo');
    modalState.active('InputStreet');
  }

  return (
    <Card className="max-w-120 pointer-events-auto">
      <CardHeader className="flex flex-row items-center space-x-2.5">
        <div className="flex items-center justify-center w-12 h-10  bg-primary/10 text-primary">
          <MapPin />
        </div>
        <CardTitle className="text-lg font-semibold text-foreground">
          Для спрощення роботи нам потрібна ваша геолокація
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-muted-foreground">
          Це допоможе автоматично визначити, звідки надходить скарга. Якщо ви не
          бажаєте вмикати геолокацію, будь ласка, вказуйте вулицю та номер
          будинку в заявах вручну.
        </p>

        <div className="flex w-full gap-3 mt-2">
          <Button variant="outline" className="flex-1" onClick={handleDecline}>
            Відмовитися
          </Button>
          <Button className="flex-1" onClick={handle}>
            Погодитися
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default observer(GeolocationAccessModal);
