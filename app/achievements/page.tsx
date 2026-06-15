"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getAchievements } from "@/lib/achievements-firestore";
import { Achievement } from "@/types/achievement";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0, 0, 0.2, 1] as const },
  },
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const data = await getAchievements();
        setAchievements(data);
      } catch (err) {
        console.error("Failed to fetch achievements:", err);
        setError("Failed to load achievements");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAchievements();
  }, []);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % achievements.length : null
    );
  }, [selectedIndex, achievements.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev !== null
        ? (prev - 1 + achievements.length) % achievements.length
        : null
    );
  }, [selectedIndex, achievements.length]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, goNext, goPrev]);

  const selectedAchievement =
    selectedIndex !== null ? achievements[selectedIndex] : null;

  return (
    <PageTransition>
      <main className="min-h-screen bg-bg-primary">
        <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8 max-w-6xl">
          {/* Header */}
          <motion.header
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-2">
              Achievements
            </h1>
            <p className="text-text-secondary text-base md:text-lg">
              Certifications, awards, and recognitions
            </p>
          </motion.header>

          {/* Divider */}
          <motion.div
            className="h-px bg-linear-to-r from-transparent via-border-subtle to-transparent mb-6"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <LoadingSpinner size="lg" message="Loading achievements..." />
            </div>
          ) : error ? (
            <div className="achievement-empty-state">
              <svg
                className="w-12 h-12 text-text-muted mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <p className="text-text-muted text-lg">{error}</p>
            </div>
          ) : achievements.length === 0 ? (
            <div className="achievement-empty-state">
              <svg
                className="w-16 h-16 text-text-muted mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.852m0 0a6.023 6.023 0 01-2.77-.852"
                />
              </svg>
              <p className="text-text-muted text-lg">No achievements yet</p>
              <p className="text-text-muted text-sm mt-1">
                Add certificates via the admin panel
              </p>
            </div>
          ) : (
            <motion.div
              className="achievement-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  variants={cardVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="achievement-card"
                  onClick={() => openLightbox(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openLightbox(index);
                    }
                  }}
                >
                  <div className="achievement-card-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={achievement.imageUrl}
                      alt={achievement.title}
                      loading="lazy"
                    />
                    <div className="achievement-card-overlay">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="achievement-card-body">
                    <h3 className="achievement-card-title">
                      {achievement.title}
                    </h3>
                    <p className="achievement-card-issuer">
                      {achievement.issuer}
                    </p>
                    {achievement.date && (
                      <p className="achievement-card-date">
                        {achievement.date}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Lightbox Modal */}
          <AnimatePresence>
            {selectedAchievement && (
              <motion.div
                className="lightbox-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={closeLightbox}
              >
                <motion.div
                  className="lightbox-content"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    className="lightbox-close"
                    onClick={closeLightbox}
                    aria-label="Close"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  {/* Navigation Arrows */}
                  {achievements.length > 1 && (
                    <>
                      <button
                        className="lightbox-nav lightbox-nav-prev"
                        onClick={goPrev}
                        aria-label="Previous"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        className="lightbox-nav lightbox-nav-next"
                        onClick={goNext}
                        aria-label="Next"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Certificate Image */}
                  <div className="lightbox-image-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedAchievement.imageUrl}
                      alt={selectedAchievement.title}
                      className="lightbox-image"
                    />
                  </div>

                  {/* Info Bar */}
                  <div className="lightbox-info">
                    <h2 className="lightbox-title">
                      {selectedAchievement.title}
                    </h2>
                    <div className="lightbox-meta">
                      <span className="lightbox-issuer">
                        {selectedAchievement.issuer}
                      </span>
                      {selectedAchievement.date && (
                        <>
                          <span className="lightbox-dot">•</span>
                          <span className="lightbox-date">
                            {selectedAchievement.date}
                          </span>
                        </>
                      )}
                    </div>
                    {selectedAchievement.description && (
                      <p className="lightbox-description">
                        {selectedAchievement.description}
                      </p>
                    )}
                    {/* Counter */}
                    {achievements.length > 1 && selectedIndex !== null && (
                      <p className="lightbox-counter">
                        {selectedIndex + 1} / {achievements.length}
                      </p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </PageTransition>
  );
}
