'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import * as h3 from 'h3-js';
import 'leaflet/dist/leaflet.css';

interface MockTicket {
  id: string;
  location_hint: string;
  count: number;
  normalized: number;
}

const MOCK_BACKEND_RESPONSE: MockTicket[] = [
  {
    id: '872ec18d6ffffff',
    location_hint: 'Київ, центр (Хрещатик / Майдан)',
    count: 4800,
    normalized: 1.0,
  },
  {
    id: '872ec112effffff',
    location_hint: 'Київ, Поділ',
    count: 3200,
    normalized: 0.67,
  },
  {
    id: '872a9dd2cffffff',
    location_hint: 'Львів, Старе Місто (Площа Ринок)',
    count: 4100,
    normalized: 0.85,
  },
  {
    id: '872a906aaffffff',
    location_hint: 'Одеса, Приморський бульвар / Опера',
    count: 2900,
    normalized: 0.6,
  },
  {
    id: '872ebd020ffffff',
    location_hint: 'Харків, Площа Свободи',
    count: 2100,
    normalized: 0.44,
  },
  {
    id: '872eb4b25ffffff',
    location_hint: 'Дніпро, Набережна / центр',
    count: 1800,
    normalized: 0.38,
  },
  {
    id: '872ec1852ffffff',
    location_hint: 'Київ, Гідропарк',
    count: 450,
    normalized: 0.09,
  },
];

interface ProcessedPoint {
  id: string;
  coordinates: [number, number];
  radius: number;
  color: string;
  hint: string;
  count: number;
}

export default function BaseMap() {
  const UKRAINE_CENTER: [number, number] = [48.3794, 31.1656];
  const DEFAULT_ZOOM = 6;
  const [mounted, setMounted] = useState(false);
  const [heatPoints, setHeatPoints] = useState<ProcessedPoint[]>([]);

  const getMarkerStyle = (normalized: number) => {
    if (normalized >= 0.9) return { color: '#ef4444', radius: 18 };
    if (normalized >= 0.6) return { color: '#f97316', radius: 14 };
    if (normalized >= 0.3) return { color: '#eab308', radius: 11 };
    return { color: '#3b82f6', radius: 8 };
  };

  const convertH3ToLatLng = (id: string): [number, number] | null => {
    try {
      if (typeof h3.cellToLatLng === 'function') {
        return h3.cellToLatLng(id) as [number, number];
      }
      if (typeof (h3 as any).h3ToGeo === 'function') {
        return (h3 as any).h3ToGeo(id) as [number, number];
      }
      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    setMounted(true);

    const formattedPoints = MOCK_BACKEND_RESPONSE.map((ticket) => {
      const validH3Id = ticket.id.toUpperCase().trim();
      const h3Coords = convertH3ToLatLng(validH3Id);

      if (!h3Coords || isNaN(h3Coords[0]) || isNaN(h3Coords[1])) {
        return null;
      }

      const style = getMarkerStyle(ticket.normalized);

      return {
        id: ticket.id,
        coordinates: [h3Coords[0], h3Coords[1]],
        radius: style.radius,
        color: style.color,
        hint: ticket.location_hint,
        count: ticket.count,
      };
    }).filter(Boolean) as ProcessedPoint[];

    setHeatPoints(formattedPoints);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 mt-8 mb-12">
        <div className="w-full h-[560px] bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8 mb-12 font-sans flex flex-col gap-4">
      <p className="text-lg md:text-xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight m-0">
        Карта скарг по Україні у живому часі
      </p>

      <div className="relative w-full h-[560px] rounded-xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800 mt-2">
        <MapContainer
          center={UKRAINE_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          minZoom={5}
        >
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {heatPoints.map((point) => (
            <CircleMarker
              key={point.id}
              center={point.coordinates}
              radius={point.radius}
              pathOptions={{
                fillColor: point.color,
                fillOpacity: 0.7,
                color: point.color,
                weight: 2,
              }}
            >
              <Popup>
                <div className="p-1 min-w-[160px] font-sans text-zinc-900">
                  <strong className="text-sm block mb-1 font-semibold">
                    {point.hint}
                  </strong>
                  <span className="text-xs text-zinc-500">
                    Кількість заяв:{' '}
                    <b className="text-zinc-950 font-semibold">{point.count}</b>
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
