"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "@/types/project";
import { StatusBadge } from "./StatusBadge";
import { ImageWithFallback } from "./ImageWithFallback";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/${project.slug}`}>
      <motion.div
        className="block rounded-xl overflow-hidden bg-[#141414] border border-white/6 hover:border-white/12 transition-colors cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 0 30px rgba(6, 182, 212, 0.15)",
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Thumbnail - 16:9 aspect ratio */}
        <div className="relative aspect-video bg-[#0a0a0a]">
          <ImageWithFallback
            src={project.imageUrl}
            alt={`${project.name} thumbnail`}
            fill
            className="object-cover"
            fallbackType="thumbnail"
            projectName={project.name}
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Header with favicon and name */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 relative shrink-0">
              <ImageWithFallback
                src={project.faviconUrl}
                alt={`${project.name} favicon`}
                width={16}
                height={16}
                className="rounded-sm"
                fallbackType="favicon"
                projectName={project.name}
              />
            </div>
            <h3 className="text-white font-semibold text-lg">{project.name}</h3>
          </div>

          {/* Description */}
          <p className="text-[#a1a1a1] text-sm line-clamp-2">
            {project.description}
          </p>

          {/* Tech Stack Preview */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-xs bg-white/5 text-[#a1a1a1] rounded"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="px-2 py-0.5 text-xs text-[#6b7280]">
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Status Badge */}
          <StatusBadge status={project.status} />
        </div>
      </motion.div>
    </Link>
  );
}
