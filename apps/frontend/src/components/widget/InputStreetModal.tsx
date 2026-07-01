'use client';

import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import container, { TYPES } from '@/infrastructure/Container';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import ModalState from '@/state/Modal.state';
import ChangeStreetLocalRequest from '@/request/ChangeStreetLocal.request'; // Перевірте шлях до реквесту
import { MapPinPen } from 'lucide-react';

const modalState = container.get<ModalState>(TYPES.ModalState);

function InputStreetModal() {
  const [streetInput, setStreetInput] = useState('');

  if (!modalState.isActive('InputStreet')) return null;

  async function handleSave() {
    if (!streetInput.trim()) return;

    const request = container.get<ChangeStreetLocalRequest>(TYPES.ChangeStreetRequest);

    try {
      if (streetInput.length === 0) {
        return;
      }
      await request.execute(streetInput);
      modalState.unactive('InputStreet');
    } catch (error) {
      console.error(error);
      modalState.unactive('InputStreet');
    }
  }


  return (
    <div className="flex flex-col items-center gap-4 max-w-sm mx-auto p-6 rounded-2xl border bg-card text-center shadow-sm">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
        <MapPinPen className="w-6 h-6" />
      </div>

      <h1 className="text-lg font-semibold text-foreground">
        Напишіть, де ви зараз перебуваєте для підтримки
      </h1>

      <p className="text-sm text-muted-foreground">
        Будь ласка, вкажіть назву вулиці вручну, щоб ми могли коректно обробити
        ваш запит.
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
          disabled={!streetInput.trim()} // Вимикаємо кнопку, якщо інпут порожній
        >
          Зберегти
        </Button>
      </div>
    </div>
  );
}

export default observer(InputStreetModal);
