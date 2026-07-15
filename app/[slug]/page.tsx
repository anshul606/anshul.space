"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useProjects } from "@/context/ProjectContext";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { FilmGrain } from "@/components/FilmGrain";
import { Project } from "@/types/project";

export default function ProjectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { projects, isLoading } = useProjects();
  const [project, setProject] = useState<Project | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isLoading) {
      const found = projects.find((p) => p.slug === slug);
      if (found) {
        setProject(found);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    }
  }, [projects, slug, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" message="Reading archives..." />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
        <div className="text-center space-y-6">
          <h1 className="text-8xl font-extrabold font-display text-accent leading-none">404</h1>
          <p className="font-mono text-sm text-text-secondary uppercase tracking-widest">[ PROJECT NOT IN ARCHIVES ]</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-accent uppercase font-bold border border-accent/20 px-6 py-3 hover:bg-accent hover:text-black transition-colors"
          >
            ← Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <FilmGrain />

      <div className="min-h-screen bg-bg-primary text-text-primary pb-20">
        
        {/* Back navigation header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-accent transition-colors cursor-none"
          >
            ← [ BACK TO JOURNAL ]
          </Link>
        </div>

        <motion.article
          className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          
          {/* Main Title & Image Frame */}
            <div className="space-y-8">
            
            {/* Display Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display leading-[0.9] uppercase tracking-tight break-words">
                  {project.name}
                </h1>
                <StatusBadge status={project.status} />
              </div>
              <p className="font-serif italic text-lg sm:text-xl text-text-secondary leading-relaxed pl-4 border-l-2 border-accent/40">
                {project.description}
              </p>
            </div>

            {/* Large Image Cover with Zine Border */}
            <div 
              className="relative aspect-video bg-black border border-white/10 overflow-hidden group cursor-none"
              data-cursor="view"
              onClick={() => {
                window.open(project.websiteUrl, "_blank");
              }}
            >
              <ImageWithFallback
                src={project.imageUrl}
                alt={project.name}
                fill
                className="object-cover zine-image-hover"
                fallbackType="thumbnail"
                projectName={project.name}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/45 transition-colors">
                <span className="font-mono text-xs text-white bg-accent px-4 py-1.5 font-bold uppercase select-none opacity-0 group-hover:opacity-100 transition-opacity">
                  [ VISIT SITE ]
                </span>
              </div>
            </div>

            {/* Dynamic Zine Content Columns */}
            <div className="space-y-8 pt-4">
              {project.longDescription && (
                <section className="space-y-3">
                  <h2 className="font-display text-sm font-bold uppercase tracking-wider text-accent">
                    [ PROJECT BRIEF ]
                  </h2>
                  <p className="text-text-secondary leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                    {project.longDescription}
                  </p>
                </section>
              )}

              {project.features && project.features.length > 0 && (
                <section className="space-y-3">
                  <h2 className="font-display text-sm font-bold uppercase tracking-wider text-accent">
                    [ KEY FEATURES ]
                  </h2>
                  <ul className="space-y-2.5">
                    {project.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-text-secondary text-sm leading-relaxed"
                      >
                        <span className="text-accent font-mono text-[10px] mt-1">[✓]</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

          </div>

            {/* Sidebar Specs Panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Editorial Metadata Table */}
            <div className="border border-white/10 p-6 bg-white/[0.01] space-y-6">
              
              <div className="space-y-4">
                <h3 className="font-mono text-xs text-text-muted uppercase tracking-wider">
                  [ METADATA SPECS ]
                </h3>
                <div className="space-y-3 font-mono text-xs uppercase text-text-secondary">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-text-muted">ROLE</span>
                    <span className="text-text-primary font-bold">{project.role || "Lead Developer"}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-text-muted">YEAR</span>
                    <span className="text-text-primary font-bold">{project.year || "2026"}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-text-muted">SYSTEM</span>
                    <span className="text-text-primary font-bold">{project.system || "Web App"}</span>
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="flex flex-col gap-3 pt-2">
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-accent hover:bg-accent-hover text-black font-mono text-xs font-bold py-3 uppercase transition-colors cursor-none"
                >
                  Visit Website
                </a>
                
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center border border-white/10 hover:border-white/20 text-text-secondary hover:text-white font-mono text-xs font-bold py-3 uppercase transition-all cursor-none"
                  >
                    View Source
                  </a>
                )}
              </div>

            </div>

            {/* Tech Stack Grid */}
            {project.techStack && project.techStack.length > 0 && (
              <div className="border border-white/10 p-6 bg-white/[0.01] space-y-4">
                <h3 className="font-mono text-xs text-text-muted uppercase tracking-wider">
                  [ TOOLSET / STACK ]
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-white/5 border border-white/5 font-mono text-xs uppercase text-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            </div>

        </motion.article>
      </div>
    </>
  );
}
