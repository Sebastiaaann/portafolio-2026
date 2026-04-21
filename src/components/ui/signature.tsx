"use client";

import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import opentype from "opentype.js";

interface SignatureProps {
  text: string;
  color?: string; // default #000
  fontSize?: number; // default 14
  duration?: number; // default 1.5
  delay?: number; // default 0
  className?: string;
  inView?: boolean; // default false
  fontUrl?: string; // to keep it flexible
}

export function Signature({
  text,
  color = "#000",
  fontSize = 14,
  duration = 1.5,
  delay = 0,
  className = "",
  inView = false,
  fontUrl = "/LastoriaBoldRegular.otf",
}: SignatureProps) {
  const [svgPaths, setSvgPaths] = useState<string[]>([]);
  const [boundingBox, setBoundingBox] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }>({ x1: 0, y1: 0, x2: 0, y2: 0 });

  useEffect(() => {
    async function loadFontAndGeneratePaths() {
      try {
        const response = await fetch(fontUrl);
        const buffer = await response.arrayBuffer();
        const font = opentype.parse(buffer);

        // Get array of paths for each glyph
        const paths = font.getPaths(text, 0, 0, fontSize);
        
        // Calculate overall bounding box using the full path
        const fullPath = font.getPath(text, 0, 0, fontSize);
        const bb = fullPath.getBoundingBox();
        
        setBoundingBox(bb);
        setSvgPaths(paths.map((p: any) => p.toPathData(2)));
      } catch (error) {
        console.error("Error loading font for Signature:", error);
      }
    }

    loadFontAndGeneratePaths();
  }, [text, fontUrl, fontSize]);

  if (!svgPaths.length) {
    return <div className={className} />; // Placeholder while loading
  }

  const width = boundingBox.x2 - boundingBox.x1;
  const height = boundingBox.y2 - boundingBox.y1;
  
  // Add slight padding to the viewbox to avoid clipping
  const padding = fontSize * 0.2;
  const viewBox = `${boundingBox.x1 - padding} ${boundingBox.y1 - padding} ${width + padding * 2} ${height + padding * 2}`;

  return (
    <div className={`flex items-center justify-start ${className}`}>
      <motion.svg
        width="100%"
        height="100%"
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {svgPaths.map((path, index) => {
          const pathDelay = delay + index * 0.15;
          return (
            <motion.path
              key={index}
              d={path}
              initial="hidden"
              animate={inView ? "visible" : undefined}
              whileInView={!inView ? "visible" : undefined}
              viewport={{ once: true, margin: "-20px" }}
              variants={{
                hidden: { pathLength: 0, fill: "transparent", opacity: 0 },
                visible: {
                  pathLength: 1,
                  fill: color,
                  opacity: 1,
                  transition: {
                    pathLength: { 
                      duration: duration, 
                      delay: pathDelay,
                      ease: "easeInOut" 
                    },
                    fill: { 
                      duration: 0.5, 
                      delay: pathDelay + duration - 0.2, 
                      ease: "easeIn" 
                    },
                    opacity: { 
                      duration: 0.2, 
                      delay: pathDelay 
                    }
                  },
                },
              }}
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
      </motion.svg>
    </div>
  );
}
