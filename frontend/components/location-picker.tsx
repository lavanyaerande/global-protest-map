"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LocationPickerProps {
  value?: { lat: number; lng: number; address?: string };
  onChange: (location: { lat: number; lng: number; address?: string }) => void;
  className?: string;
}

export function LocationPicker({ value, onChange, className }: LocationPickerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(value?.address || "");

  const updateMarker = useCallback((lat: number, lng: number, address?: string) => {
    if (mapRef.current) {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], {
          draggable: true,
          icon: L.divIcon({
            className: "custom-marker",
            html: `
              <div style="
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                border: 3px solid white;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
              ">
                <div style="
                  width: 14px;
                  height: 14px;
                  background: white;
                  border-radius: 50%;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                "></div>
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          }),
        }).addTo(mapRef.current);

        markerRef.current.on("dragend", () => {
          const pos = markerRef.current?.getLatLng();
          if (pos) {
            onChange({ lat: pos.lat, lng: pos.lng, address: selectedAddress });
            reverseGeocode(pos.lat, pos.lng);
          }
        });
      }

      mapRef.current.setView([lat, lng], 15, { animate: true });
      onChange({ lat, lng, address });
    }
  }, [onChange, selectedAddress]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        setSelectedAddress(data.display_name);
        onChange({ lat, lng, address: data.display_name });
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
     const response = await fetch(`http://127.0.0.1:8000/search-location?q=${encodeURIComponent(searchQuery)}`);
      const results = await response.json();

      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        setSelectedAddress(display_name);
        updateMarker(parseFloat(lat), parseFloat(lon), display_name);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      center: value ? [value.lat, value.lng] : [40, -95],
      zoom: value ? 15 : 4,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(mapRef.current);

    mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
      updateMarker(e.latlng.lat, e.latlng.lng);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    if (value) {
      updateMarker(value.lat, value.lng, value.address);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchLocation()}
            className="pl-9"
          />
        </div>
        <Button onClick={searchLocation} disabled={isSearching}>
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </div>

      <div
        ref={containerRef}
        className="w-full h-64 rounded-lg border border-border overflow-hidden"
      />

      {selectedAddress && (
        <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
          <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-foreground">Selected Location</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {selectedAddress}
            </p>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Click on the map or search to set the protest location. You can drag the marker to adjust.
      </p>
    </div>
  );
}

export default LocationPicker;
