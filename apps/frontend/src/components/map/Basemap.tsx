'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { cellToLatLng, isValidCell } from 'h3-js';

interface BackendTicket {
  id?: string;
  h3Id?: string;
  count: number;
  status: 'new' | 'in_progress' | 'completed';
  location_hint?: string;
  normalized?: number;
}

function getLatLngFromH3(h3Index: string): [number, number] {
  const UKRAINE_CENTER: [number, number] = [48.3794, 31.1656];

  try {
    if (!h3Index || !isValidCell(h3Index)) {
      return UKRAINE_CENTER;
    }
    const [lat, lng] = cellToLatLng(h3Index);
    return [lat, lng];
  } catch (e) {
    console.error('Помилка конвертації H3:', e);
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
        const response = await fetch('/api/tickets');
        
        if (!response.ok) {
          throw new Error('Бекенд повернув помилку, вмикаємо mock-дані');
        }
        
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.warn('Не вдалося завантажити скарги з сервера, підвантажуємо тестові дані:', error);
        
        // Твої тестові дані з реальними H3 гексагонами для України
        const mockData: BackendTicket[] = [
          {
            id: "872ec18d6ffffff",
            location_hint: "Київ, центр (Хрещатик / Майдан)",
            count: 4800,
            normalized: 1.0,
            status: "new"
          },
          {
            id: "872ec112effffff",
            location_hint: "Київ, Поділ",
            count: 3200,
            normalized: 0.67,
            status: "in_progress"
          },
          {
            id: "872a9dd2cffffff",
            location_hint: "Львів, Старе Місто (Площа Ринок)",
            count: 4100,
            normalized: 0.85,
            status: "completed"
          },
          {
            id: "872a906aaffffff",
            location_hint: "Одеса, Приморський бульвар / Опера",
            count: 2900,
            normalized: 0.6,
            status: "new"
          },
          {
            id: "872ebd020ffffff",
            location_hint: "Харків, Площа Свободи",
            count: 2100,
            normalized: 0.44,
            status: "in_progress"
          },
          {
            id: "872eb4b25ffffff",
            location_hint: "Дніпро, Набережна / центр",
            count: 1800,
            normalized: 0.38,
            status: "completed"
          }
        ];
        
        setTickets(mockData);
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
      default:
        return { color: '#9ca3af', label: 'Невідомо' };
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

      <div className="relative w-full h-150 rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 z-[999]">
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
            maxZoom={12}
          >
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {tickets.map((ticket, index) => {
              const { color, label } = getStatusStyle(ticket.status);
              const h3Index = ticket.h3Id || ticket.id || '';
              const coords = getLatLngFromH3(h3Index);

              const radius = ticket.normalized
                ? 6 + ticket.normalized * 15
                : 6 + (ticket.count / 5000) * 8;

              return (
                <CircleMarker
                  key={`${h3Index}-${index}`}
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
                        H3 ID: {h3Index}
                      </strong>

                      {ticket.location_hint && (
                        <span className="text-sm font-semibold block mb-2">
                          {ticket.location_hint}
                        </span>
                      )}

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
