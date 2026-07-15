"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CinemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string | null;
  title: string;
}

function parseVideoUrl(url: string | null) {
  if (!url) return null;

  // YouTube matchers
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const ytMatch = url.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
    };
  }

  // Vimeo matchers
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&color=ff3344&dnt=1`,
    };
  }

  // Raw MP4/WebM video matchers
  if (
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.endsWith(".ogg") ||
    url.includes("drive.google.com") // drive URLs can sometimes be parsed directly, otherwise iframe
  ) {
    return {
      type: "raw",
      embedUrl: url,
    };
  }

  // Falling back to direct iframe injection
  return {
    type: "iframe",
    embedUrl: url,
  };
}

export function CinemaModal({ isOpen, onClose, videoUrl, title }: CinemaModalProps) {
  const parsed = parseVideoUrl(videoUrl);

  // Esc key listeners and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && parsed && (
        <motion.div
          className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-5xl aspect-video bg-[#0a0a0c] border border-white/10 flex flex-col justify-between overflow-hidden"
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header specs bar (Zine branding) */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.02] font-mono text-[10px] tracking-wider text-text-secondary select-none">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                [ CINEMA SCREENING ROOM ]
              </span>
              <span className="hidden sm:inline text-text-muted truncate max-w-md">
                PROJECT: {title}
              </span>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-accent font-bold transition-colors uppercase flex items-center gap-1"
              >
                <span>[CLOSE]</span>
              </button>
            </div>

            {/* Video content frame */}
            <div className="flex-1 w-full h-full bg-[#000000] relative">
              {parsed.type === "raw" ? (
                <video
                  src={parsed.embedUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={parsed.embedUrl}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-none"
                />
              )}
            </div>

            {/* Footer metadata description */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-white/10 bg-white/[0.02] font-mono text-[9px] text-text-muted">
              <span>FORMAT: 16:9 HD</span>
              <span>SCENARIO: REEL PLAYBACK</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
