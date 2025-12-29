"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  fallbackType?: "thumbnail" | "favicon";
  projectName?: string;
}

function ThumbnailFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] text-gray-600">
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
}

function FaviconFallback({ projectName }: { projectName?: string }) {
  const initial = projectName?.charAt(0).toUpperCase() || "?";
  return (
    <div className="w-full h-full rounded-sm bg-cyan-500/20 flex items-center justify-center">
      <span className="text-[8px] text-cyan-500 font-bold">{initial}</span>
    </div>
  );
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  fallbackType = "thumbnail",
  projectName,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!src || hasError) {
    if (fallbackType === "favicon") {
      return <FaviconFallback projectName={projectName} />;
    }
    return <ThumbnailFallback />;
  }

  return (
    <>
      {isLoading && fallbackType === "thumbnail" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
          <div className="w-6 h-6 border-2 border-[#141414] border-t-[#06b6d4] rounded-full animate-spin" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
}
