// import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';
// import { useMemo } from 'react';
// import useMarketPulse from '../utils/hooks/useMarketPulse';

// export default function BackgroundEffects({ scrollYProgress, mouseX, mouseY }: any) {
//   const { sentiment, volatility } = useMarketPulse();
//   const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
//   const chartOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.1, 0.3, 0.3, 0.1]);
//   const particleMovement = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
//   // Fixed: Use useMemo with deterministic values to prevent hydration mismatch
//   const floatingParticles = useMemo(() => {
//     // Use deterministic seed-based approach instead of Math.random()
//     const particles = [];
//     for (let i = 0; i < 12; i++) {
//       // Create pseudo-random but deterministic values based on index
//       const seed1 = (i * 23 + 17) % 97;
//       const seed2 = (i * 31 + 13) % 89;
//       const seed3 = (i * 37 + 19) % 83;
//       const seed4 = (i * 41 + 7) % 79;
//       const seed5 = (i * 43 + 11) % 73;
      
//       particles.push({
//         id: i,
//         x: (seed1 / 97) * 100, // 0-100%
//         y: (seed2 / 89) * 100, // 0-100%
//         size: (seed3 / 83) * 4 + 2, // 2-6px
//         duration: (seed4 / 79) * 10 + 15, // 15-25s
//         delay: (seed5 / 73) * 5 // 0-5s
//       });
//     }
//     return particles;
//   }, []); // Empty dependency array - only calculate once

//   return (
//     <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
//       {floatingParticles.map((particle) => (
//         <motion.div
//           key={particle.id}
//           className={`absolute rounded-full ${
//             sentiment === 'bullish' ? 'bg-emerald-400/30' :
//             sentiment === 'bearish' ? 'bg-red-400/30' :
//             'bg-cyan-400/30'
//           }`}
//           style={{
//             left: `${particle.x}%`,
//             top: `${particle.y}%`,
//             width: `${particle.size}px`,
//             height: `${particle.size}px`,
//             y: particleMovement
//           }}
//           animate={{
//             y: [-20, 20],
//             opacity: [0.3, 0.7, 0.3],
//             scale: [1, 1.2, 1]
//           }}
//           transition={{
//             duration: particle.duration,
//             repeat: Infinity,
//             ease: "easeInOut",
//             delay: particle.delay
//           }}
//         />
//       ))}

//       {/* Trading Symbols */}
//       <motion.div
//         className="absolute left-1/4 top-1/4 w-20 h-20 opacity-10"
//         animate={{
//           y: [-50, 50],
//           rotate: [0, 360],
//           scale: [1, 1.1, 1]
//         }}
//         transition={{
//           duration: 20,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//         style={{
//           x: useTransform(mouseX, [0, 1], [-10, 10]),
//           y: useTransform(mouseY, [0, 1], [-10, 10])
//         }}
//       >
//         <div className="text-6xl">📈</div>
//       </motion.div>

//       {/* ... other background elements ... */}
//     </div>
//   );
// }

// components/BackgroundEffects.tsx
'use client';

import { motion, useTransform, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';
import useMarketPulse from '@/utils/hooks/useMarketPulse';

export default function BackgroundEffects({ sentiment }: { sentiment: string }) {
  const { volatility } = useMarketPulse();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const backgroundY = useTransform(useMotionValue(0), [0, 1], ['0%', '50%']);
  const chartOpacity = useTransform(useMotionValue(0), [0, 1], [0.1, 0.3]);
  const particleMovement = useTransform(useMotionValue(0), [0, 1], [0, 100]);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-[#0d1117] to-[#1a1f2e]"
        style={{ y: backgroundY }}
      />
      
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{ opacity: chartOpacity }}
      >
        <div className="grid grid-cols-4 gap-4 w-full h-full">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="border border-gray-700 rounded-lg" />
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="absolute inset-0"
        style={{ 
          background: `radial-gradient(circle at center, ${
            sentiment === 'bullish' 
              ? 'rgba(34, 197, 94, 0.05)' 
              : sentiment === 'bearish' 
                ? 'rgba(239, 68, 68, 0.05)' 
                : 'rgba(56, 189, 248, 0.05)'
          }, transparent 70%)`,
          opacity: volatility / 100
        }}
      />
    </div>
  );
}