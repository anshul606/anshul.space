"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Journal/Home", href: "/" },
  { name: "Achievements", href: "/achievements" },
  { name: "Resume", href: "/resume" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [displayText, setDisplayText] = useState("./");
  const [targetText, setTargetText] = useState("./");

  // Track sections via IntersectionObserver on homepage scroll
  useEffect(() => {
    if (pathname !== "/") return;

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px", // Band focusing on the upper-middle viewport
      threshold: 0.05,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const techSec = document.getElementById("tech");
    const bgSec = document.getElementById("background");
    const projSec = document.getElementById("projects");

    if (techSec) observer.observe(techSec);
    if (bgSec) observer.observe(bgSec);
    if (projSec) observer.observe(projSec);

    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection("home");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // Determine typewriter targetText
  useEffect(() => {
    if (pathname !== "/") {
      const segment = pathname.split("/").filter(Boolean)[0] || "";
      setTargetText(`./${segment}`);
    } else {
      if (activeSection === "home") {
        setTargetText("./");
      } else {
        setTargetText(`./${activeSection}`);
      }
    }
  }, [pathname, activeSection]);

  // Run character typing/deleting typewriter transitions
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const animate = () => {
      if (displayText === targetText) return;

      if (targetText.startsWith(displayText)) {
        const nextChar = targetText[displayText.length];
        timer = setTimeout(() => {
          setDisplayText((prev) => prev + nextChar);
        }, 55);
      } else {
        timer = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1));
        }, 25);
      }
    };

    animate();

    return () => clearTimeout(timer);
  }, [displayText, targetText]);

  // Hide navbar on admin pages
  if (pathname?.startsWith("/admin")) return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="navbar-inner">
        {/* Logo - Terminal prompt style with typewriter scroll typing */}
        <Link href="/" className="navbar-logo-terminal">
          <span>{displayText}</span>
          <span className="terminal-cursor" />
        </Link>

        {/* Desktop Links - Monospace and minimalist */}
        <div className="navbar-links-desktop">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar-link ${active ? "navbar-link-active" : ""}`}
              >
                <span className="relative z-10">{link.name}</span>
                {active && (
                  <motion.span
                    className="navbar-link-dot"
                    layoutId="navbar-active-dot"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="navbar-mobile-toggle"
          aria-label="Toggle menu"
        >
          <span className={`navbar-hamburger ${isMobileOpen ? "navbar-hamburger-open" : ""}`}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="navbar-mobile-menu"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`navbar-mobile-link ${isActive(link.href) ? "navbar-mobile-link-active" : ""}`}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
