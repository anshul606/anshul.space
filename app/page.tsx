"use client";

import { useProjects } from "@/context/ProjectContext";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { FilmGrain } from "@/components/FilmGrain";
import Link from "next/link";

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

export default function Home() {
  const { projects, isLoading } = useProjects();

  return (
    <>
      <FilmGrain />

      <main className="min-h-screen bg-bg-primary text-text-primary">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          
          {/* ── HERO SECTION ── */}
          <header className="mb-20 md:mb-32 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            
            {/* Developer Text Content */}
            <div className="md:col-span-8 space-y-6">
              <div className="space-y-3">
                <span className="font-mono text-xs text-accent uppercase tracking-widest block">
                  [ PORTFOLIO / JOURNAL ]
                </span>
                
                {/* Greeting & Name */}
                <h1 className="text-5xl sm:text-7xl lg:text-9xl font-extrabold font-display leading-[0.8] tracking-tighter uppercase select-none">
                  ANSHUL
                  <span className="text-accent">.</span>
                </h1>
                
                {/* Title / Role */}
                <p className="font-mono text-sm sm:text-base text-accent tracking-wider uppercase">
                  Full-Stack Developer & Designer
                </p>
              </div>

              {/* Bio Description */}
              <div className="max-w-2xl border-l-2 border-accent/20 pl-6 py-1">
                <p className="font-sans text-text-secondary text-base md:text-lg leading-relaxed">
                  I build things for the web. Passionate about creating elegant solutions to complex problems, crafting delightful user experiences, and exploring the intersection of design and technology.
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
                className="relative group border border-white/10 p-2 bg-white/[0.01] overflow-hidden w-full max-w-[280px] aspect-square text-left cursor-none focus:outline-none"
                data-cursor="view"
              >
                <div className="absolute inset-0 border border-white/5 pointer-events-none m-2 group-hover:border-accent/40 transition-colors duration-500" />
                <img
                  src="/anshul.jpeg"
                  alt="Anshul portrait"
                  className="w-full h-full object-cover zine-image-hover"
                />
                <span className="absolute bottom-4 right-4 bg-accent text-black font-mono text-[9px] font-bold px-2 py-0.5 select-none uppercase">
                  [ DEV_STATION ]
                </span>
              </button>
            </div>
          </header>

          {/* ── BACKGROUND & CAPABILITIES GRID ── */}
          <section className="mb-24 md:mb-36">
            <div className="font-mono text-xs text-text-muted mb-4 tracking-wider uppercase">
              [ 01 / BACKGROUND & CAPABILITIES ]
            </div>
            
            {/* Asymmetrical Zine Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 zine-grid">
              
              {/* Cell 1: Background & Education */}
              <div className="p-8 zine-cell space-y-4">
                <h3 className="font-display text-xl font-bold uppercase text-text-primary">
                  BACKGROUND & EDUCATION
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  B.Tech in Computer Science & Engineering student at LNMIIT Jaipur (2025 – 2029). Co-organizer for Google Developer Group (GDG) Jaipur and active hackathon builder, focused on modern full-stack systems and developer productivity tools.
                </p>
              </div>

              {/* Cell 2: Technical Skills */}
              <div className="p-8 zine-cell space-y-4">
                <h3 className="font-display text-xl font-bold uppercase text-text-primary">
                  LANGUAGES & FRAMEWORKS
                </h3>
                <ul className="font-mono text-xs text-text-secondary space-y-2 uppercase">
                  <li className="flex items-center justify-between border-b border-white/5 pb-1">
                    <span>TypeScript / JS</span>
                    <span className="text-accent">Expert</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-1">
                    <span>Next.js / React</span>
                    <span className="text-accent">Framework</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-1">
                    <span>Node.js / Redux</span>
                    <span className="text-accent">State & Backend</span>
                  </li>
                  <li className="flex items-center justify-between pb-1">
                    <span>Tailwind / Shadcn</span>
                    <span className="text-accent">UI Engine</span>
                  </li>
                </ul>
              </div>

              {/* Cell 3: Tools & Creative Suite */}
              <div className="p-8 zine-cell space-y-4">
                <h3 className="font-display text-xl font-bold uppercase text-text-primary">
                  TOOLS & CREATIVE SUITE
                </h3>
                <ul className="font-mono text-xs text-text-secondary space-y-2 uppercase">
                  <li className="flex items-center justify-between border-b border-white/5 pb-1">
                    <span>Convex / Firebase</span>
                    <span className="text-accent">Real-time DB</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-1">
                    <span>Clerk / Auth</span>
                    <span className="text-accent">Security</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-1">
                    <span>Git / GitHub</span>
                    <span className="text-accent">VCS</span>
                  </li>
                  <li className="flex items-center justify-between pb-1">
                    <span>Premiere / After Effects</span>
                    <span className="text-accent">Creative</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Bottom Row Cell - GDG & LNMIIT Focus */}
            <div className="p-8 border-b border-white/8 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <span className="font-mono text-xs text-accent uppercase tracking-wider">
                [ CURRENT ACTIVE ENGAGEMENT ]
              </span>
              <span className="font-mono text-xs text-text-secondary text-sm md:text-right uppercase">
                GDG JAIPUR ORGANIZER // GDG LNMIIT ACTIVE MEMBER
              </span>
            </div>
          </section>

          {/* ── PROJECTS GRID SHOWCASE ── */}
          <section id="projects" className="mb-24 md:mb-36">
            <div className="mb-8 flex justify-between items-end">
              <div>
                <div className="font-mono text-xs text-text-muted tracking-wider uppercase">
                  [ 02 / SELECTED WORK ]
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold uppercase mt-2">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
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
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
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
