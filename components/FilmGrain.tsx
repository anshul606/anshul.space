"use client";

import { useEffect, useState } from "react";

export function FilmGrain() {
  const [noiseUrl, setNoiseUrl] = useState<string | null>(null);

  useEffect(() => {
    // Generate static noise tileable PNG on canvas once
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.createImageData(canvas.width, canvas.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const val = Math.floor(Math.random() * 255);
      data[i] = val;     // R
      data[i + 1] = val; // G
      data[i + 2] = val; // B
      data[i + 3] = 255; // A (Fully opaque, styling opacity handles the strength)
    }

    ctx.putImageData(imgData, 0, 0);
    setNoiseUrl(canvas.toDataURL("image/png"));
  }, []);

  if (!noiseUrl) return null;

  return (
    <div
      className="film-grain"
      style={{ backgroundImage: `url(${noiseUrl})` }}
    />
  );
}
