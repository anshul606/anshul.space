"use client";

import { useState } from "react";
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
        {/* Logo - Bold display font */}
        <Link href="/" className="navbar-logo cursor-none">
          ANSHUL<span className="navbar-logo-dot">.</span>
        </Link>

        {/* Desktop Links - Monospace and minimalist */}
        <div className="navbar-links-desktop">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`navbar-link cursor-none ${active ? "navbar-link-active" : ""}`}
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
          className="navbar-mobile-toggle cursor-none"
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
