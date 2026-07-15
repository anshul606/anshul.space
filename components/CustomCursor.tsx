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

  // Smooth spring physics for the trailing ring (tuned for snappier follow speed)
  const ringX = useSpring(cursorX, { stiffness: 380, damping: 28, mass: 0.4 });
  const ringY = useSpring(cursorY, { stiffness: 380, damping: 28, mass: 0.4 });

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

  // Animation values for the inner dot and trailing ring based on hover state
  const ringVariants = {
    default: {
      width: 40,
      height: 40,
      backgroundColor: "rgba(0, 0, 0, 0)",
      borderColor: "rgba(255, 51, 68, 0.4)",
    },
    pointer: {
      width: 60,
      height: 60,
      backgroundColor: "rgba(255, 51, 68, 0.05)",
      borderColor: "rgba(255, 51, 68, 0.8)",
    },
    play: {
      width: 80,
      height: 80,
      backgroundColor: "rgba(255, 51, 68, 0.95)",
      borderColor: "rgba(255, 51, 68, 1)",
    },
    view: {
      width: 80,
      height: 80,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "rgba(255, 255, 255, 1)",
    },
  };

  const dotVariants = {
    default: { scale: 1, backgroundColor: "#ff3344" },
    pointer: { scale: 0.5, backgroundColor: "#ff3344" },
    play: { scale: 0, backgroundColor: "#ffffff" },
    view: { scale: 0, backgroundColor: "#000000" },
  };

  return (
    <>
      {/* Lag-free exact tracking inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
        style={{ x: cursorX, y: cursorY }}
        animate={cursorType}
        variants={dotVariants}
        transition={{ duration: 0.15 }}
      />

      {/* Trailing smooth physics ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 overflow-hidden"
        style={{ x: ringX, y: ringY }}
        animate={cursorType}
        variants={ringVariants}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
      >
        {/* Monospace overlay labels inside the cursor */}
        {cursorType === "play" && (
          <span className="font-mono text-[9px] font-bold text-black tracking-wider uppercase select-none">
            Play
          </span>
        )}
        {cursorType === "view" && (
          <span className="font-mono text-[9px] font-bold text-black tracking-wider uppercase select-none">
            View
          </span>
        )}
      </motion.div>
    </>
  );
}
