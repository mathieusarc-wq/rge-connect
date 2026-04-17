"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Simplified France border polygon (mainland)
const FRANCE_COORDS: [number, number][] = [
  [51.09, 2.54], [50.95, 1.59], [49.01, -1.14], [48.63, -4.79],
  [47.80, -4.25], [47.27, -2.52], [46.35, -1.78], [45.23, -1.24],
  [44.39, -1.25], [43.63, -1.79], [42.65, -1.77], [42.34, 0.68],
  [42.33, 3.17], [43.21, 3.28], [43.07, 5.40], [43.28, 6.63],
  [43.70, 7.41], [43.79, 7.53], [44.14, 6.93], [44.85, 6.63],
  [45.82, 7.04], [46.46, 6.78], [46.93, 6.19], [47.49, 7.60],
  [48.30, 7.79], [49.05, 8.23], [49.44, 6.74], [49.46, 6.37],
  [50.13, 5.99], [50.37, 4.85], [51.09, 2.54],
];

interface ZoneMapProps {
  center: [number, number];
  radiusKm: number;
}

export function ZoneMap({ center, radiusKm }: ZoneMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const franceRef = useRef<L.Polygon | null>(null);
  const maskRef = useRef<L.Polygon | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom: 6,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    // France border outline
    const francePoly = L.polygon(FRANCE_COORDS, {
      color: "#2d5a3d",
      weight: 2,
      fillOpacity: 0,
      dashArray: "6 4",
    }).addTo(map);

    // Mask outside France: big world rectangle with France hole
    const worldBounds: [number, number][] = [
      [90, -180], [90, 180], [-90, 180], [-90, -180], [90, -180],
    ];
    const maskPoly = L.polygon(
      [worldBounds, FRANCE_COORDS],
      { color: "transparent", fillColor: "#f5efe4", fillOpacity: 0.7, stroke: false }
    ).addTo(map);

    // Circle
    const circle = L.circle(center, {
      radius: radiusKm * 1000,
      color: "#2d5a3d",
      weight: 2,
      fillColor: "#2d5a3d",
      fillOpacity: 0.08,
    }).addTo(map);

    // Center marker
    const markerIcon = L.divIcon({
      className: "",
      html: `<div style="width:16px;height:16px;border-radius:50%;background:#2d5a3d;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });
    L.marker(center, { icon: markerIcon }).addTo(map);

    mapInstanceRef.current = map;
    circleRef.current = circle;
    franceRef.current = francePoly;
    maskRef.current = maskPoly;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update circle radius
  useEffect(() => {
    if (!circleRef.current || !mapInstanceRef.current) return;
    circleRef.current.setRadius(radiusKm * 1000);

    // Auto-fit zoom based on radius
    const bounds = circleRef.current.getBounds();
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  }, [radiusKm]);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-xl overflow-hidden"
      style={{ height: 480 }}
    />
  );
}
