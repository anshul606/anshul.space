"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface HighlightTextProps {
  text: string;
  highlights: string[]; // Array of words/phrases to highlight
}

export function HighlightText({ text, highlights }: HighlightTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasBeenHovered, setHasBeenHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setHasBeenHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Split text into parts based on highlight terms
  const renderHighlightedText = () => {
    let processedText = text;
    const parts: Array<{ text: string; isHighlight: boolean; index: number }> =
      [];

    // Create a map of positions for each highlight term
    const highlightPositions: Array<{
      start: number;
      end: number;
      text: string;
    }> = [];

    highlights.forEach((highlight) => {
      const regex = new RegExp(highlight, "gi");
      let match;

      while ((match = regex.exec(text)) !== null) {
        highlightPositions.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
        });
      }
    });

    // Sort by start position
    highlightPositions.sort((a, b) => a.start - b.start);

    // Build parts array
    let currentIndex = 0;
    let partIndex = 0;

    highlightPositions.forEach((pos) => {
      // Add non-highlighted text before this highlight
      if (currentIndex < pos.start) {
        parts.push({
          text: text.substring(currentIndex, pos.start),
          isHighlight: false,
          index: partIndex++,
        });
      }

      // Add highlighted text
      parts.push({
        text: pos.text,
        isHighlight: true,
        index: partIndex++,
      });

      currentIndex = pos.end;
    });

    // Add remaining non-highlighted text
    if (currentIndex < text.length) {
      parts.push({
        text: text.substring(currentIndex),
        isHighlight: false,
        index: partIndex++,
      });
    }

    return parts;
  };

  const parts = renderHighlightedText();
  const shouldShowHighlight = isHovered || hasBeenHovered;

  return (
    <p
      className="font-sans text-text-secondary text-base md:text-lg leading-relaxed"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {parts.map((part) => {
        if (!part.isHighlight) {
          return <span key={part.index}>{part.text}</span>;
        }

        return (
          <motion.span
            key={part.index}
            className="relative inline-block"
            initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            animate={{
              backgroundColor: shouldShowHighlight
                ? "rgba(255, 51, 68, 0.2)"
                : "rgba(0, 0, 0, 0)",
            }}
            transition={{
              duration: 0.4,
              delay: part.index * 0.08,
              ease: "easeOut",
            }}
          >
            <motion.span
              className="relative px-1 font-semibold"
              initial={{ color: "#a09fa6" }}
              animate={{
                color: shouldShowHighlight ? "#ffffff" : "#a09fa6",
              }}
              transition={{
                duration: 0.4,
                delay: part.index * 0.08,
                ease: "easeOut",
              }}
            >
              {part.text}
            </motion.span>
          </motion.span>
        );
      })}
    </p>
  );
}
