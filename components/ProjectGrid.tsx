"use client";

import { motion } from "framer-motion";
import { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { EmptyState } from "./EmptyState";

interface ProjectGridProps {
  projects: Project[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {projects.map((project) => (
        <motion.div key={project.id} variants={itemVariants} className="h-full">
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  );
}
