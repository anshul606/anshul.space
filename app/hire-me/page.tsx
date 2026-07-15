"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { FilmGrain } from "@/components/FilmGrain";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import WhatsAppContact from "@/components/WhatsAppContact";
import { getGeneralSettings } from "@/lib/achievements-firestore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function HireMePage() {
  const [availableForWork, setAvailableForWork] = useState<boolean | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchSettings() {
      try {
        const settings = await getGeneralSettings();
        setAvailableForWork(settings?.availableForWork ?? null);
      } catch (err) {
        console.error("Failed to fetch availability status:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  return (
    <PageTransition>
      <FilmGrain />
      <main className="min-h-screen bg-bg-primary text-text-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          {/* Hero Section */}
          <motion.header
            className="flex flex-col gap-6 mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="space-y-3">
              <span className="font-mono text-xs text-accent uppercase tracking-widest block">
                [ PORTFOLIO / CONTACT & COLLABORATION ]
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold font-display leading-[0.9] uppercase tracking-tight">
                HIRE ME<span className="text-accent">.</span>
              </h1>
              <p className="font-sans text-text-secondary text-sm md:text-base leading-relaxed pl-4 border-l-2 border-accent/40 max-w-2xl">
                Let&apos;s collaborate on your next project. I&apos;m available
                for freelance work, consulting, and full-time opportunities.
              </p>
            </motion.div>
          </motion.header>

          {/* Divider */}
          <motion.div
            className="h-px bg-linear-to-r from-transparent via-border-subtle to-transparent mb-8"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />

          {/* Contact Information Section */}
          <motion.section
            className="mb-16 md:mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Card */}
              <div className="p-6 border border-white/8 bg-white/1 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Email</h3>
                    <a
                      href="mailto:anshulbansal2406@gmail.com"
                      className="text-accent hover:underline text-sm"
                    >
                      anshulbansal2406@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* LinkedIn Card */}
              <div className="p-6 border border-white/8 bg-white/1 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-accent/10 rounded-lg">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">LinkedIn</h3>
                    <a
                      href="https://www.linkedin.com/in/anshulbansalxd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline text-sm"
                    >
                      linkedin.com/in/anshulbansalxd
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Status */}
            {isLoading ? (
              <div className="mt-6 flex items-center gap-2 text-text-secondary">
                <LoadingSpinner size="sm" />
                <span className="text-sm">Loading availability...</span>
              </div>
            ) : (
              availableForWork !== null && (
                <div
                  className={`mt-6 p-4 rounded-lg ${availableForWork ? "border border-green-500/20 bg-green-500/5" : "border border-red-500/20 bg-red-500/5"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      {availableForWork && (
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${availableForWork ? "bg-green-500" : "bg-red-500"}`}
                        ></span>
                      )}
                      <span
                        className={`relative inline-flex rounded-full h-3 w-3 ${availableForWork ? "bg-green-500" : "bg-red-500"}`}
                      ></span>
                    </span>
                    <div>
                      <p className="font-medium text-white text-sm">
                        Availability Status
                      </p>
                      <p className="text-text-secondary text-sm">
                        {availableForWork
                          ? "Available for new projects"
                          : "Currently unavailable"}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </motion.section>

          {/* WhatsApp Contact Section */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <WhatsAppContact />
          </motion.section>
        </div>
      </main>
    </PageTransition>
  );
}
