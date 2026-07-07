'use client';

import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import container, { TYPES } from '@/infrastructure/Container';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import ModalState from '@/state/Modal.state';
import ChangeStreetLocalRequest from '@/request/ChangeStreetLocal.request';
import { MapPinPen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const modalState = container.get<ModalState>(TYPES.ModalState);

function InputStreetModal() {
  const [streetInput, setStreetInput] = useState('');

  if (!modalState.isActive('InputStreet')) return null;

  async function handleSave() {
    if (!streetInput.trim()) return;

    const request = container.get<ChangeStreetLocalRequest>(
      TYPES.ChangeStreetRequest,
    );

    try {
      await request.execute(streetInput);
      modalState.unactive('InputStreet');
      modalState.active('ticket');
    } catch (error) {
      console.error(error);
      modalState.unactive('InputStreet');
    }
  }

  return (
    <Card className="max-w-120 pointer-events-auto max-md:max-w-90">
      <CardHeader className="flex flex-row space-x-2 items-center">
        <div className="flex items-center justify-center w-12 h-10  bg-primary/10 text-primary">
          <MapPinPen />
        </div>
        <CardTitle className="text-lg font-semibold text-foreground">
          Напишіть, де ви зараз перебуваєте для підтримки
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-muted-foreground">
          Будь ласка, вкажіть назву вулиці вручну, щоб ми могли коректно
          обробити ваш запит.
        </p>

        <div className="w-full mt-2">
          <Input
            placeholder="Введіть назву вулиці..."
            value={streetInput}
            onChange={(e) => setStreetInput(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex w-full gap-3 mt-2">
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={!streetInput.trim()}
          >
            Зберегти
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default observer(InputStreetModal);
