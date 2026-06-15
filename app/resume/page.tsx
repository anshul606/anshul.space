"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getResumeConfig } from "@/lib/achievements-firestore";
import {
  driveShareToEmbed,
  driveShareToDownload,
  driveShareToViewLink,
} from "@/lib/drive-utils";
import { ResumeConfig } from "@/types/achievement";

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

export default function ResumePage() {
  const [resumeConfig, setResumeConfig] = useState<ResumeConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResume() {
      try {
        const config = await getResumeConfig();
        setResumeConfig(config);
      } catch (err) {
        console.error("Failed to fetch resume config:", err);
        setError("Failed to load resume");
      } finally {
        setIsLoading(false);
      }
    }
    fetchResume();
  }, []);

  const embedUrl = resumeConfig?.driveLink
    ? driveShareToEmbed(resumeConfig.driveLink)
    : null;
  const downloadUrl = resumeConfig?.driveLink
    ? driveShareToDownload(resumeConfig.driveLink)
    : null;
  const viewUrl = resumeConfig?.driveLink
    ? driveShareToViewLink(resumeConfig.driveLink)
    : null;

  return (
    <PageTransition>
      <main className="min-h-screen bg-bg-primary">
        <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8 max-w-5xl">
          {/* Header */}
          <motion.header
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight ">
                Resume
              </h1>
              <p className="text-text-secondary text-base md:text-lg mt-2">
                My professional background and experience
              </p>
            </motion.div>

            {/* Action Buttons */}
            {resumeConfig?.driveLink && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-3"
              >
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-action-btn resume-action-btn-primary"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download Resume
                  </a>
                )}
                {viewUrl && (
                  <a
                    href={viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-action-btn resume-action-btn-secondary"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Open in Drive
                  </a>
                )}
              </motion.div>
            )}
          </motion.header>

          {/* Divider */}
          <motion.div
            className="h-px bg-linear-to-r from-transparent via-border-subtle to-transparent mb-8"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />

          {/* Resume Viewer */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <LoadingSpinner size="lg" message="Loading resume..." />
              </div>
            ) : error ? (
              <div className="resume-empty-state">
                <div className="resume-empty-icon">
                  <svg
                    className="w-12 h-12 text-text-muted"
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
                </div>
                <p className="text-text-muted text-lg">{error}</p>
              </div>
            ) : embedUrl ? (
              <div className="resume-viewer">
                <div className="resume-viewer-frame">
                  <iframe
                    src={embedUrl}
                    className="resume-iframe"
                    title="Resume"
                    allow="autoplay"
                    sandbox="allow-same-origin allow-scripts allow-popups"
                  />
                </div>
              </div>
            ) : (
              <div className="resume-empty-state">
                <div className="resume-empty-icon">
                  <svg
                    className="w-12 h-12 text-text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <p className="text-text-muted text-lg">
                  Resume not yet configured
                </p>
                <p className="text-text-muted text-sm mt-1">
                  Add a Google Drive link via the admin panel
                </p>
              </div>
            )}
          </motion.section>
        </div>
      </main>
    </PageTransition>
  );
}
