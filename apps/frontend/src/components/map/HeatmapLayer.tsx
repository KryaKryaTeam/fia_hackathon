'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

type HeatPoint = [number, number, number];

interface HeatmapLayerProps {
  points: HeatPoint[];
  radius?: number;
  blur?: number;
  max?: number;
}

export default function HeatmapLayer({
  points,
  radius = 2000,
  blur = 10,
  max = 3.0,
}: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    const heatLayer = L.heatLayer(points, { radius, blur, max }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, radius, blur, max]);

  return null;
}