"use client";

import * as React from "react";
import { motion } from "framer-motion";

const DELAYS = [0, 0.05, 0.12, 0.19, 0.26, 0.33];

export function StaggerSection({
  index,
  children,
  className,
}: {
  index: number;
  children: React.ReactNode;
  className?: string;
}) {
  const delay = DELAYS[index] ?? index * 0.06;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
