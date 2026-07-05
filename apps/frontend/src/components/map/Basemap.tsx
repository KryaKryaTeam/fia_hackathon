'use client';

import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { cellToLatLng, isValidCell } from 'h3-js';
import container, { TYPES } from '@/infrastructure/Container';
import GetPointersNetworkRequest, { Pointer } from '@/request/point/GetPointersNetwork.request';
import HeatmapLayer from './HeatmapLayer';

function pointerToHeatPoint(pointer: Pointer): [number, number, number] | null {
  if (!pointer.id || !isValidCell(pointer.id)) return null;

  const [lat, lng] = cellToLatLng(pointer.id);
  return [lat, lng, pointer.normalized];
}

export default function BaseMap() {
  const UKRAINE_CENTER: [number, number] = [48.3794, 31.1656];
  const DEFAULT_ZOOM = 6;
  const request = container.get<GetPointersNetworkRequest>(
    TYPES.GetPointersNetworkRequest,
  );
  const [pointers, setPointers] = useState<Pointer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPointers() {
      setIsLoading(true);
      const response = await request.execute(undefined, { mock: true });
      setPointers(response);
      setIsLoading(false);
    }

    fetchPointers();
  }, []);

  const totalCount = pointers.reduce((acc, pointer) => acc + pointer.count, 0);

  const heatPoints = useMemo(() => {
    return pointers
      .map(pointerToHeatPoint)
      .filter((p): p is [number, number, number] => p !== null);
  }, [pointers]);
  console.log('heatPoints', heatPoints);
  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8 mb-12 font-sans flex flex-col gap-4">
      <p className="text-lg md:text-xl font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight m-0">
        Карта скарг по Україні у живому часі
      </p>

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

            <HeatmapLayer points={heatPoints} max={1.0} radius={99} blur={50} />
          </MapContainer>
        )}
      </div>
    </div>
  );
}