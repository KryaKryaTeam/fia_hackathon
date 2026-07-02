/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface BackendTicket {
  h3Id: string;
  count: number;
  status: 'new' | 'in_progress' | 'completed';
}

function pureH3ToLatLng(h3Id: string): [number, number] {
  const UKRAINE_CENTER: [number, number] = [48.3794, 31.1656];

  try {
    const regions: Record<string, [number, number]> = {
      '872ec1': [50.4501, 30.5234],
      '872a9d': [49.8397, 24.0297],
      '872a90': [46.4825, 30.7233],
      '872ada': [50.0011, 36.2304],
    };

    const prefix = h3Id.substring(0, 6);
    const baseCoords = regions[prefix] || UKRAINE_CENTER;

    const tail = h3Id.substring(6, 11);
    const numValue = parseInt(tail, 16) || 0;

    const latShift = ((numValue % 100) - 50) / 700;
    const lngShift = (((numValue / 100) % 100) - 50) / 400;

    return [baseCoords[0] + latShift, baseCoords[1] + lngShift];
  } catch (e) {
    return UKRAINE_CENTER;
  }
}

export default function BaseMap() {
  const UKRAINE_CENTER: [number, number] = [48.3794, 31.1656];
  const DEFAULT_ZOOM = 6;

  const [tickets, setTickets] = useState<BackendTicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/tickets'); // Замініть на ваш реальний ендпоінт бекенду
        if (!response.ok) {
          throw new Error('Помилка завантаження даних');
        }
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Не вдалося завантажити скарги з сервера:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTickets();
  }, []);

  const counts = tickets.reduce(
    (acc, ticket) => {
      if (ticket.status === 'new') acc.new += ticket.count;
      if (ticket.status === 'in_progress') acc.inProgress += ticket.count;
      if (ticket.status === 'completed') acc.completed += ticket.count;
      return acc;
    },
    { new: 0, inProgress: 0, completed: 0 },
  );

  const getStatusStyle = (status: 'new' | 'in_progress' | 'completed') => {
    switch (status) {
      case 'new':
        return { color: '#ef4444', label: 'Нових' };
      case 'in_progress':
        return { color: '#eab308', label: 'В процесі' };
      case 'completed':
        return { color: '#22c55e', label: 'Виконано' };
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8 mb-12 font-sans flex flex-col gap-4">
      <p className="text-lg md:text-xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight m-0">
        Карта скарг по Україні у живому часі
      </p>

      <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-6 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <p className="text-sm font-medium text-zinc-300 m-0">
            Нових:{' '}
            <b className="text-zinc-50">{isLoading ? '...' : counts.new}</b>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <p className="text-sm font-medium text-zinc-300 m-0">
            В процесі:{' '}
            <b className="text-zinc-50">
              {isLoading ? '...' : counts.inProgress}
            </b>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <p className="text-sm font-medium text-zinc-300 m-0">
            Виконано:{' '}
            <b className="text-zinc-50">
              {isLoading ? '...' : counts.completed}
            </b>
          </p>
        </div>
      </div>

      <div className="relative w-full h-140 rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 z-999">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-50" />
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Завантаження карти...
            </span>
          </div>
        ) : (
          <MapContainer
            center={UKRAINE_CENTER}
            zoom={DEFAULT_ZOOM}
            style={{ height: '100%', width: '100%' }}
            minZoom={5}
            maxZoom={10}
          >
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {tickets.map((ticket, index) => {
              const { color, label } = getStatusStyle(ticket.status);
              const coords = pureH3ToLatLng(ticket.h3Id);

              const maxCount = 5000;
              const radius = 6 + (ticket.count / maxCount) * 8;

              return (
                <CircleMarker
                  key={`${ticket.h3Id}-${index}`}
                  center={coords}
                  radius={radius}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.6,
                    color: color,
                    weight: 1.5,
                  }}
                >
                  <Popup>
                    <div className="p-1 min-w-40 font-sans text-zinc-900">
                      <strong className="text-xs block mb-1 text-zinc-400 font-mono break-all">
                        H3 ID: {ticket.h3Id}
                      </strong>
                      <div className="text-xs text-zinc-600 flex flex-col gap-1 mt-1">
                        <span>
                          Кількість заяв:{' '}
                          <b className="text-zinc-950 font-semibold">
                            {ticket.count}
                          </b>
                        </span>
                        <span>
                          Статус:{' '}
                          <b style={{ color }} className="font-semibold">
                            {label}
                          </b>
                        </span>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
