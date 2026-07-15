"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [cursorType, setCursorType] = useState<
    "default" | "pointer" | "play" | "view"
  >("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Motion values for exact cursor tracking (low latency)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring physics for the trailing ring (faster response)
  const ringX = useSpring(cursorX, { stiffness: 600, damping: 30, mass: 0.2 });
  const ringY = useSpring(cursorY, { stiffness: 600, damping: 30, mass: 0.2 });

  useEffect(() => {
    // Detect touch device (hide custom cursor on iPads/phones)
    const checkTouchDevice = () => {
      const isTouch =
        window.matchMedia("(any-hover: none)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;
      setIsTouchDevice(isTouch);
      if (!isTouch) {
        document.body.classList.add("custom-cursor-active");
      }
    };

    checkTouchDevice();

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Event delegation to catch hover types dynamically
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor]',
      );
      if (interactive) {
        const type = interactive.getAttribute("data-cursor");
        if (type === "play") {
          setCursorType("play");
        } else if (type === "view") {
          setCursorType("view");
        } else {
          setCursorType("pointer");
        }
      } else {
        setCursorType("default");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  // Animation values - tech/crosshair inspired design
  const ringVariants = {
    default: {
      width: 32,
      height: 32,
      backgroundColor: "rgba(0, 0, 0, 0)",
      borderColor: "rgba(255, 51, 68, 0.6)",
    },
    pointer: {
      width: 48,
      height: 48,
      backgroundColor: "rgba(255, 51, 68, 0.08)",
      borderColor: "rgba(255, 51, 68, 1)",
    },
    play: {
      width: 64,
      height: 64,
      backgroundColor: "rgba(255, 51, 68, 1)",
      borderColor: "rgba(255, 51, 68, 1)",
    },
    view: {
      width: 64,
      height: 64,
      backgroundColor: "rgba(255, 255, 255, 1)",
      borderColor: "rgba(255, 255, 255, 1)",
    },
  };

  const dotVariants = {
    default: { scale: 1, backgroundColor: "#ff3344" },
    pointer: { scale: 0, backgroundColor: "#ff3344" },
    play: { scale: 0, backgroundColor: "#000000" },
    view: { scale: 0, backgroundColor: "#000000" },
  };

  return (
    <>
      {/* Center dot - sharp square for tech aesthetic */}
      <motion.div
        className="fixed top-0 left-0 w-[3px] h-[3px] rounded-none pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ x: cursorX, y: cursorY }}
        animate={cursorType}
        variants={dotVariants}
        transition={{ duration: 0.15 }}
      />

      {/* Crosshair lines - only visible on default state */}
      {cursorType === "default" && (
        <>
          {/* Horizontal line */}
          <motion.div
            className="fixed top-0 left-0 w-4 h-[1px] bg-accent/40 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
            style={{ x: cursorX, y: cursorY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.2 }}
          />
          {/* Vertical line */}
          <motion.div
            className="fixed top-0 left-0 w-[1px] h-4 bg-accent/40 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
            style={{ x: cursorX, y: cursorY }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.2 }}
          />
        </>
      )}

      {/* Outer ring - square with rounded corners for tech aesthetic */}
      <motion.div
        className="fixed top-0 left-0 border pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 overflow-hidden"
        style={{ x: ringX, y: ringY, borderRadius: "4px" }}
        animate={cursorType}
        variants={ringVariants}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
      >
        {/* Corner brackets for tech feel - only on default */}
        {cursorType === "default" && (
          <>
            {/* Top-left corner */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent/60" />
            {/* Top-right corner */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent/60" />
            {/* Bottom-left corner */}
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent/60" />
            {/* Bottom-right corner */}
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent/60" />
          </>
        )}

        {/* Labels for play/view states */}
        {cursorType === "play" && (
          <span className="font-mono text-[8px] font-bold text-black tracking-widest uppercase select-none">
            PLAY
          </span>
        )}
        {cursorType === "view" && (
          <span className="font-mono text-[8px] font-bold text-black tracking-widest uppercase select-none">
            VIEW
          </span>
        )}
      </motion.div>
    </>
  );
}
