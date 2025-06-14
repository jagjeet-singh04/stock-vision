import { motion } from 'framer-motion';
import { ReactNode } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

export default function SectionCard({ 
  children,
  variants,
  className = ""
}: {
  children: ReactNode;
  variants: any;
  className?: string;
}) {
  if (!children) return null; 

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
      whileHover="hover"
      className={`bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl transform-gpu ${className}`}
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`
      }}
    >
      {children}
    </motion.div>
  );
}
