"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface BlurRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  blur?: string;
}

export function BlurReveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
  yOffset = 20,
  blur = "10px",
}: BlurRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: yOffset, filter: `blur(${blur})` },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={defaultVariants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // ease-out-quart
      }}
      className={cn("will-change-[opacity,transform,filter]", className)}
    >
      {children}
    </motion.div>
  );
}