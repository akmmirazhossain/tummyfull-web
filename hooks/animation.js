import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Custom hook for section animations
export const useAnimatedSection = (amount = 0.4) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount });

  return { sectionRef, isInView };
};

// Reusable animated content component
export const AnimatedContent = ({
  children,
  direction = "left",
  delay = 0.2,
  className = "",
}) => {
  const xOffset = direction === "left" ? -100 : direction === "right" ? 100 : 0;
  const yOffset = direction === "up" ? 30 : direction === "down" ? -30 : 0;

  return (
    <motion.div
      className={className}
      initial={{
        x: xOffset,
        y: yOffset,
        opacity: 0,
      }}
      whileInView={{
        x: 0,
        y: 0,
        opacity: 1,
      }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
    >
      {children}
    </motion.div>
  );
};

// Main animated section component
export const AnimatedSection = ({
  children,
  className = "",
  viewAmount = 0.4,
  ...props
}) => {
  const { sectionRef, isInView } = useAnimatedSection(viewAmount);

  return (
    <section
      ref={sectionRef}
      className={`overflow-hidden ${className}`}
      {...props}
    >
      {typeof children === "function" ? children(isInView) : children}
    </section>
  );
};
