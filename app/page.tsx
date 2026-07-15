"use client";

import { useProjects } from "@/context/ProjectContext";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { FilmGrain } from "@/components/FilmGrain";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getGeneralSettings, GeneralSettings } from "@/lib/achievements-firestore";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-56 bg-bg-secondary flex items-center justify-center border-b border-white/5 font-mono text-[10px] text-text-muted">
      LOADING ARCHIVE MAP DATA...
    </div>
  ),
});

// Social links matching original structure
const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/anshul606",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/anshulbansalxd/",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "Email",
    url: "mailto:anshulbansal2406@gmail.com",
    icon: (
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
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

const techIcons: Record<string, React.ReactNode> = {
  typescript: (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.5 1.5v21h21v-21H1.5zm10.74 15.35c-.18.73-.66 1.33-1.46 1.54-1.12.3-2.22-.43-2.42-1.54l1.6-.26c.09.43.34.78.74.83.42.06.84-.19.86-.62.01-.22-.1-.41-.33-.51-.31-.15-.65-.25-.97-.37-.58-.2-1.04-.54-1.27-1.11-.27-.66-.11-1.39.4-1.92.54-.53 1.33-.73 2.05-.53.79.22 1.33.87 1.45 1.66l-1.57.34c-.07-.35-.29-.6-.62-.64-.32-.04-.63.14-.66.44-.02.19.09.35.28.43.33.15.69.25 1.03.37.53.18.96.48 1.18 1 .28.67.14 1.42-.36 1.95zm7.39-4.84h-2.12v6.62h-1.63v-6.62h-2.1v-1.41h5.85v1.41z"/>
    </svg>
  ),
  "next.js": (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.66 18l-5.61-7.25v7.25H10.4V7.57h1.64l5.63 7.27V7.57h1.65V18h-1.66z"/>
    </svg>
  ),
  "react.js": (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(0 12 12)"/>
      <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(120 12 12)"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  ),
  react: (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(0 12 12)"/>
      <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(120 12 12)"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  ),
  "tailwind css": (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.002 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
    </svg>
  ),
  tailwind: (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.002 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
    </svg>
  ),
  "node.js": (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7.75v11.5L12 22l10-5.75V7.75L12 2zm8.35 15l-8.35 4.8-8.35-4.8V9l8.35-4.8L20.35 9v8z"/>
    </svg>
  ),
  node: (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7.75v11.5L12 22l10-5.75V7.75L12 2zm8.35 15l-8.35 4.8-8.35-4.8V9l8.35-4.8L20.35 9v8z"/>
    </svg>
  ),
  firebase: (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.89 15.67L9.58 2.2a.5.5 0 0 1 .93 0l1.7 4-6.32 9.47zm16.22-1.12l-2.02-3.83-2.13-4.03a.5.5 0 0 0-.91.06L12.44 12l7.67 2.55zm-1.12 4.9L3.4 12.98l7.66-1.52 7.93 8z"/>
    </svg>
  ),
  convex: (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm0 3.25L18.5 9 12 12.75 5.5 9 12 5.25zm0 13.5L5.5 15v-4.5l6.5 3.75 6.5-3.75V15l-6.5 3.75z"/>
    </svg>
  ),
  rust: (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-.55 0-1 .45-1 1v1.17c-.75.16-1.46.46-2.11.88l-.83-.83a.996.996 0 1 0-1.41 1.41l.83.83c-.42.65-.72 1.36-.88 2.11H5c-.55 0-1 .45-1 1s.45 1 1 1h1.17c.16.75.46 1.46.88 2.11l-.83.83a.996.996 0 1 0 1.41 1.41l.83-.83c.65.42 1.36.72 2.11.88V21c0 .55.45 1 1 1s1-.45 1-1v-1.17c.75-.16 1.46-.46 2.11-.88l.83.83a.996.996 0 1 0 1.41-1.41l-.83-.83c.42-.65.72-1.36.88-2.11H19c.55 0 1-.45 1-1s-.45-1-1-1h-1.17c-.16-.75-.46-1.46-.88-2.11l.83-.83a.996.996 0 1 0-1.41-1.41l-.83.83c-.65-.42-1.36-.72-2.11-.88V3c0-.55-.45-1-1-1zm0 6c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z" />
    </svg>
  ),
  "three.js": (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 22h20L12 2zm0 4.25L18.5 18H5.5L12 6.25z"/>
    </svg>
  ),
  three: (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 22h20L12 2zm0 4.25L18.5 18H5.5L12 6.25z"/>
    </svg>
  ),
  "git / github": (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.6 10.5l9.5-9.5c.8-.8 2-.8 2.8 0l9.5 9.5c.8.8.8 2 0 2.8L14.9 22.8c-.8.8-2 .8-2.8 0L2.6 13.3c-.8-.8-.8-2 0-2.8zM12 15.6c-.6 0-1-.4-1-1v-4.8c0-.6.4-1 1-1s1 .4 1 1v4.8c0 .6-.4 1-1 1zm0 2.6c.9 0 1.6-.7 1.6-1.6s-.7-1.6-1.6-1.6-1.6.7-1.6 1.6.7 1.6 1.6 1.6zm4.8-4.8c.9 0 1.6-.7 1.6-1.6s-.7-1.6-1.6-1.6-1.6.7-1.6 1.6.7 1.6 1.6 1.6z"/>
    </svg>
  ),
  git: (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.6 10.5l9.5-9.5c.8-.8 2-.8 2.8 0l9.5 9.5c.8.8.8 2 0 2.8L14.9 22.8c-.8.8-2 .8-2.8 0L2.6 13.3c-.8-.8-.8-2 0-2.8zM12 15.6c-.6 0-1-.4-1-1v-4.8c0-.6.4-1 1-1s1 .4 1 1v4.8c0 .6-.4 1-1 1zm0 2.6c.9 0 1.6-.7 1.6-1.6s-.7-1.6-1.6-1.6-1.6.7-1.6 1.6.7 1.6 1.6 1.6zm4.8-4.8c.9 0 1.6-.7 1.6-1.6s-.7-1.6-1.6-1.6-1.6.7-1.6 1.6.7 1.6 1.6 1.6z"/>
    </svg>
  ),
  github: (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.6 10.5l9.5-9.5c.8-.8 2-.8 2.8 0l9.5 9.5c.8.8.8 2 0 2.8L14.9 22.8c-.8.8-2 .8-2.8 0L2.6 13.3c-.8-.8-.8-2 0-2.8zM12 15.6c-.6 0-1-.4-1-1v-4.8c0-.6.4-1 1-1s1 .4 1 1v4.8c0 .6-.4 1-1 1zm0 2.6c.9 0 1.6-.7 1.6-1.6s-.7-1.6-1.6-1.6-1.6.7-1.6 1.6.7 1.6 1.6 1.6zm4.8-4.8c.9 0 1.6-.7 1.6-1.6s-.7-1.6-1.6-1.6-1.6.7-1.6 1.6.7 1.6 1.6 1.6z"/>
    </svg>
  ),
  "html 5": (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.5 0h21l-1.9 19.3L12 24l-8.6-4.7L1.5 0zm14 11H9.4l-.2-2.3H16l-.2-2.3H7l.6 6.8h5.6l-.3 3.3-2.9.8-2.9-.8-.2-2h-2.3l.3 4.3 5.1 1.4 5.1-1.4.7-7.9z"/>
    </svg>
  ),
  html: (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.5 0h21l-1.9 19.3L12 24l-8.6-4.7L1.5 0zm14 11H9.4l-.2-2.3H16l-.2-2.3H7l.6 6.8h5.6l-.3 3.3-2.9.8-2.9-.8-.2-2h-2.3l.3 4.3 5.1 1.4 5.1-1.4.7-7.9z"/>
    </svg>
  ),
  "css 3": (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.5 0h21l-1.9 19.3L12 24l-8.6-4.7L1.5 0zm14 11H9.4l-.2-2.3h6.8l.2-2.3H7.2l.6 6.8h5.6l-.3 3.3-2.9.8-2.9-.8-.2-2H5.1l.3 4.3 6.6 1.8 6.6-1.8.7-7.9z"/>
    </svg>
  ),
  css: (
    <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.5 0h21l-1.9 19.3L12 24l-8.6-4.7L1.5 0zm14 11H9.4l-.2-2.3h6.8l.2-2.3H7.2l.6 6.8h5.6l-.3 3.3-2.9.8-2.9-.8-.2-2H5.1l.3 4.3 6.6 1.8 6.6-1.8.7-7.9z"/>
    </svg>
  )
};

const defaultFallbackIcon = (
  <svg className="w-8 h-8 text-text-secondary group-hover:text-accent transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);

const DEFAULT_TECH = [
  "TypeScript",
  "Next.js",
  "React.js",
  "Tailwind CSS",
  "Node.js",
  "Firebase",
  "Convex",
  "Rust",
  "Three.js",
  "Git / GitHub",
  "HTML 5",
  "CSS 3"
];

interface TechStackItem {
  name: string;
  iconSvg?: string;
}

function TechStackGrid({ activeTech }: { activeTech?: TechStackItem[] }) {
  const techs: TechStackItem[] = activeTech && activeTech.length > 0 ? activeTech : DEFAULT_TECH.map(name => ({ name }));

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mt-2">
      {techs.map((tech) => {
        const key = tech.name.toLowerCase().trim();
        let icon: React.ReactNode;

        if (tech.iconSvg) {
          icon = <div className="w-6 h-6 flex items-center justify-center tech-icon-wrapper" dangerouslySetInnerHTML={{ __html: tech.iconSvg }} />;
        } else {
          const preDefinedIcon = techIcons[key] || defaultFallbackIcon;
          icon = <div className="w-6 h-6 flex items-center justify-center tech-icon-wrapper">{preDefinedIcon}</div>;
        }

        return (
          <div
            key={tech.name}
            className="group flex flex-col items-center justify-center p-3.5 bg-white/[0.01] border border-white/8 rounded-lg hover:border-accent/40 hover:bg-white/[0.02] hover:-translate-y-0.5 transition-all duration-300 select-none cursor-none"
          >
            <div className="mb-2 transform group-hover:scale-105 transition-transform duration-300">
              {icon}
            </div>
            <span className="font-mono text-[9px] text-text-secondary uppercase tracking-wider text-center break-words w-full">
              {tech.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const { projects, isLoading } = useProjects();
  const [settings, setSettings] = useState<GeneralSettings | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getGeneralSettings();
        setSettings(data);
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    }
    fetchSettings();
  }, []);

  return (
    <>
      <FilmGrain />

      <main className="min-h-screen bg-bg-primary text-text-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          
          {/* ── HERO SECTION ── */}
          <header className="mb-16 md:mb-24 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
            
            {/* Developer Text Content */}
            <div className="md:col-span-8 space-y-6">
              <div className="space-y-3">
                <span className="font-mono text-[10px] sm:text-xs text-accent uppercase tracking-wider sm:tracking-widest block">
                  [ PORTFOLIO / JOURNAL ]
                </span>
                
                {/* Greeting & Name */}
                <h1 className="text-5xl sm:text-6xl md:text-6xl font-extrabold font-display leading-[0.8] tracking-tighter uppercase select-none">
                  ANSHUL
                  <span className="text-accent">.</span>
                </h1>
                
                {/* Title / Role */}
                <p className="font-mono text-sm sm:text-base text-accent tracking-wider uppercase">
                  Full-Stack Developer & Designer
                </p>

                {/* Available for work badge */}
                {settings?.availableForWork && (
                  <div className="flex items-center gap-2 pt-1 select-none">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-green-400">
                      Available for work
                    </span>
                  </div>
                )}
              </div>

              {/* Bio Description */}
              <div className="max-w-2xl border-l-2 border-accent/20 pl-6 py-1">
                <p className="font-sans text-text-secondary text-base md:text-lg leading-relaxed">
                  I'm a full-stack developer with 2 years of experience building fast, scalable web applications with clean design and great user experiences.
                </p>
              </div>

              {/* Social Links List */}
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white/[0.02] border border-white/8 text-text-secondary hover:text-accent hover:border-accent/40 hover:bg-accent-muted transition-all duration-200 cursor-none"
                    aria-label={link.name}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Profile Frame with Raw Border Grid Lines */}
            <div className="md:col-span-4 flex justify-end">
              <button 
                onClick={() => {
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="relative group border border-white/10 p-2 bg-white/[0.01] overflow-hidden w-full max-w-[220px] aspect-square text-left cursor-none focus:outline-none"
                data-cursor="view"
              >
                <div className="absolute inset-0 border border-white/5 pointer-events-none m-2 group-hover:border-accent/40 transition-colors duration-500" />
                <img
                  src="/anshul.jpeg"
                  alt="Anshul portrait"
                  className="w-full h-full object-cover portrait-image-hover"
                />
                <span className="absolute bottom-4 right-4 bg-accent text-black font-mono text-[9px] font-bold px-2 py-0.5 select-none uppercase">
                  [ PROJECTS ]
                </span>
              </button>
            </div>
          </header>

          {/* ── 01 / TECH STACK ── */}
          <section id="tech" className="mb-24 md:mb-36">
            <div className="font-mono text-xs text-text-muted mb-6 tracking-wider uppercase">
              [ 01 / TECH STACK ]
            </div>
            
            <div className="p-8 border border-white/8 bg-white/[0.01]">
              <h3 className="font-display text-xl font-bold uppercase text-text-primary mb-4">
                TECH STACK & CAPABILITIES
              </h3>
              <TechStackGrid activeTech={settings?.techStack} />
            </div>
          </section>

          {/* ── 02 / BACKGROUND & EDUCATION ── */}
          <section id="background" className="mb-24 md:mb-36">
            <div className="font-mono text-xs text-text-muted mb-6 tracking-wider uppercase">
              [ 02 / BACKGROUND & EDUCATION ]
            </div>
            
            <div className="border border-white/8 bg-white/[0.01] overflow-hidden">
              <MapComponent
                locationName={settings?.locationName || "Jaipur, India"}
                lat={settings?.locationLat ?? 26.9124}
                lng={settings?.locationLng ?? 75.7873}
                timezone={settings?.timezone || "Asia/Kolkata"}
              />
              <div className="p-8 space-y-4">
                <h3 className="font-display text-xl font-bold uppercase text-text-primary">
                  BACKGROUND & EDUCATION
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-4xl">
                  B.Tech in Computer Science & Engineering student at LNMIIT Jaipur (2025 – 2029). Co-organizer for Google Developer Group (GDG) Jaipur and active hackathon builder, focused on modern full-stack systems and developer productivity tools.
                </p>
              </div>

              {/* Bottom Row Cell - GDG & LNMIIT Focus */}
              <div className="p-8 border-t border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/[0.005]">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  <span className="font-mono text-xs text-text-secondary uppercase tracking-widest font-semibold">
                    Current Active Engagement
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <span className="font-mono text-xs border border-white/10 px-3 py-1.5 bg-white/[0.02] text-[#f5f5f7] rounded-md tracking-wider uppercase select-none hover:border-accent/40 transition-colors">
                    GDG Jaipur Organizer
                  </span>
                  <span className="font-mono text-xs border border-white/10 px-3 py-1.5 bg-white/[0.02] text-[#f5f5f7] rounded-md tracking-wider uppercase select-none hover:border-accent/40 transition-colors">
                    GDG LNMIIT Active Member
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── PROJECTS GRID SHOWCASE ── */}
          <section id="projects" className="mb-24 md:mb-36">
            <div className="mb-8 flex justify-between items-end">
              <div>
                <div className="font-mono text-xs text-text-muted tracking-wider uppercase">
                  [ 03 / SELECTED WORK ]
                </div>
                <h2 className="font-display text-xl md:text-2xl font-extrabold uppercase mt-2">
                  DEVELOPMENT ARCHIVES
                </h2>
              </div>
            </div>

            {isLoading ? (
              <div className="py-24 flex items-center justify-center font-mono text-sm text-text-muted">
                RETRIEVING FILES...
              </div>
            ) : (
              /* Asymmetric Editorial Grid (No horizontal scroll, fully responsive) */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, idx) => {
                  const isLarge = idx % 3 === 2;
                  return (
                    <Link
                      key={project.id}
                      href={`/${project.slug}`}
                      className={`group flex flex-col justify-between border border-white/8 bg-white/[0.01] hover:border-accent/30 transition-all duration-300 cursor-none ${
                        isLarge ? "md:col-span-2" : ""
                      }`}
                      data-cursor="view"
                    >
                      {/* Header Spec Tag */}
                      <div className="flex justify-between px-4 py-2.5 border-b border-white/8 font-mono text-[9px] text-text-muted">
                        <span>[ PATH: 0{idx + 1} ]</span>
                        <span className="text-accent uppercase tracking-wider">{project.status}</span>
                      </div>

                      {/* Image Block */}
                      <div className={`relative w-full bg-[#000] overflow-hidden ${isLarge ? "aspect-video md:aspect-[21/9]" : "aspect-video"}`}>
                        <ImageWithFallback
                          src={project.imageUrl}
                          alt={project.name}
                          fill
                          className="object-cover zine-image-hover"
                          fallbackType="thumbnail"
                          projectName={project.name}
                        />
                      </div>

                      {/* Meta Info */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between font-mono text-[9px] text-text-secondary uppercase">
                            <span>SYSTEM: WEB LABS</span>
                            <span>UPDATED: {new Date(project.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
                          </div>
                          <h3 className="font-display text-xl font-extrabold tracking-tight uppercase group-hover:text-accent transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                            {project.description}
                          </p>
                        </div>

                        {/* Footer tools list */}
                        <div className="pt-4 mt-auto border-t border-white/5 flex justify-between items-center">
                          <div className="flex flex-wrap gap-1.5">
                            {project.techStack.slice(0, 3).map((tech) => (
                              <span key={tech} className="font-mono text-[9px] border border-white/10 px-2 py-0.5 text-text-muted">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <span className="font-mono text-[9px] text-accent uppercase font-bold group-hover:underline">
                            [READ DETAIL]
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>


        </div>
      </main>
    </>
  );
}
