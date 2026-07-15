"use client";

import { useEffect, useRef, useState } from "react";
import * as maptiler from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

// Set default key
maptiler.config.apiKey = "w66xaM0hp1KMOXBriVJp";

interface MapComponentProps {
  locationName: string;
  lat: number;
  lng: number;
  timezone: string;
}

export default function MapComponent({
  locationName,
  lat,
  lng,
  timezone,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptiler.Map | null>(null);
  const markerRef = useRef<maptiler.Marker | null>(null);
  const [time, setTime] = useState<Date | null>(null);

  // Timezone Clock Logic
  useEffect(() => {
    const updateTime = () => setTime(new Date());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format local time for the clock display
  const getTimeString = () => {
    if (!time) return "";
    try {
      return time.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
      });
    } catch (e) {
      return time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
      });
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing map if any
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    try {
      // Create Map with dark style - using reference string to avoid projection issues
      const map = new maptiler.Map({
        container: mapContainerRef.current,
        style: "dataviz-dark", // Simple reference style
        center: [lng, lat],
        zoom: 2.5,
        navigationControl: false,
        geolocateControl: false,
        interactive: true,
      });

      mapRef.current = map;

      // Pulse Marker
      const markerEl = document.createElement("div");
      markerEl.className =
        "relative flex h-3.5 w-3.5 items-center justify-center";

      const ping = document.createElement("span");
      ping.className =
        "absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75";

      const dot = document.createElement("span");
      dot.className = "relative inline-flex h-2.5 w-2.5 rounded-full bg-accent";

      markerEl.appendChild(ping);
      markerEl.appendChild(dot);

      const marker = new maptiler.Marker({ element: markerEl })
        .setLngLat([lng, lat])
        .addTo(map);

      markerRef.current = marker;

      // Fly to local coords after load
      map.on("load", () => {
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [lng, lat],
              zoom: 11,
              speed: 0.7,
              curve: 1.1,
              essential: true,
            });
          }
        }, 1000);
      });
    } catch (error) {
      console.error("Map initialization failed:", error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng]);

  const timeString = getTimeString();
  const timeParts = timeString.split("");

  return (
    <div className="relative w-full h-56 bg-bg-secondary overflow-hidden border-b border-white/5 select-none">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Bottom Gradient Fade - Stronger to hide logo */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-secondary via-bg-secondary/80 to-transparent z-10" />

      {/* Clock HUD Overlay */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <div className="bg-bg-primary/85 border border-white/8 backdrop-blur-md px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wider text-text-secondary shadow-lg flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          <span className="uppercase text-text-muted mr-1">{locationName}</span>
          <span className="font-semibold text-text-primary tabular-nums">
            {timeParts.map((char, i) => (
              <span
                key={i}
                className={
                  char === ":"
                    ? "animate-pulse duration-1000 opacity-60 inline-block px-[1px]"
                    : ""
                }
              >
                {char}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
