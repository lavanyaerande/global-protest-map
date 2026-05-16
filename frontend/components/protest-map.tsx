"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
// import type { Protest } from "@/lib/mock-data";

interface Protest {
  id: string
  title: string
  description: string
  date: string
  location: {
    lat: number
    lng: number
    address: string
  }
}

interface ProtestMapProps {
  protests: Protest[]
  onMarkerClick?: (protest: Protest) => void
  selectedProtest?: Protest
  center?: [number, number]
  zoom?: number
  className?: string
}
const statusColors = {
  active: "#ef4444",
  planned: "#3b82f6",
  past: "#6b7280",
};

function createCustomIcon(
  status: "active" | "planned" | "past" | undefined,
  isSelected: boolean
) {

  const color = statusColors[status ?? "past"];
  const size = isSelected ? 40 : 30;
  const borderWidth = isSelected ? 4 : 2;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: ${borderWidth}px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
        ${isSelected ? "transform: scale(1.2);" : ""}
      ">
        <div style="
          width: ${size / 3}px;
          height: ${size / 3}px;
          background-color: white;
          border-radius: 50%;
          opacity: 0.9;
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function ProtestMap({
  protests,
  onMarkerClick,
  selectedProtest,
  center = [20, 0],
  zoom = 2,
  className = "",
}: ProtestMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.MarkerClusterGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(mapRef.current);

    //    // @ts-expect-error - leaflet.markercluster types


    markersRef.current = L.markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      maxClusterRadius: 50,
      iconCreateFunction: (cluster: L.MarkerCluster) => {
        const count = cluster.getChildCount();
        let size = 40;
        if (count > 50) size = 60;
        else if (count > 20) size = 50;

        return L.divIcon({
          html: `<div style="
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000;
            font-weight: 700;
            font-size: ${size / 3}px;
            border: 3px solid white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          ">${count}</div>`,
          className: "marker-cluster-custom",
          iconSize: [size, size],
        });
      },
    });

    mapRef.current.addLayer(markersRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();

    protests.forEach((protest) => {
      if (!protest.location) return;   // <-- THIS LINE IS REQUIRED

      const marker = L.marker(
        [protest.location.lat, protest.location.lng],
        {
          icon: createCustomIcon(
            protest.status,
            selectedProtest?.id === protest.id
          ),
        }
      );

      marker.bindPopup(`
    <div style="min-width: 200px; padding: 4px;">
      <h3 style="font-weight: 600; margin-bottom: 4px; font-size: 14px;">
        ${protest.title}
      </h3>
      <p style="color: #666; font-size: 12px;">
        ${protest.location.address}
      </p>
    </div>
  `);

      marker.on("click", () => {
        onMarkerClick?.(protest);
      });

      markersRef.current?.addLayer(marker);
    });
  }, [protests, selectedProtest, onMarkerClick]);

  useEffect(() => {
    if (
      selectedProtest &&
      selectedProtest.location &&
      mapRef.current
    ) {
      mapRef.current.setView(
        [
          selectedProtest.location.lat,
          selectedProtest.location.lng
        ],
        10,
        { animate: true }
      );
    }
  }, [selectedProtest]);
  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{ minHeight: "400px" }}
    />
  );
}

export default ProtestMap;
