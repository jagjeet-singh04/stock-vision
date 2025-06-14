import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 1 } }}
    >
      <motion.div
        className="mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", damping: 10 }}
      >
        <div className="text-6xl">📊</div>
      </motion.div>
      
      <div className="flex space-x-2 mb-6">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className={`w-3 rounded-sm ${
              i % 3 === 0 ? 'bg-emerald-400' : 
              i % 3 === 1 ? 'bg-red-400' : 
              'bg-cyan-400'
            }`}
            animate={{ 
              height: [15, 50, 15],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <motion.div
        animate={{ 
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 1.5,
          ease: "easeInOut"
        }}
        className="text-xl font-semibold text-gray-300"
      >
        Initializing Market Data...
      </motion.div>
      
      <motion.div
        className="mt-4 text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Loading real-time analytics
      </motion.div>
    </motion.div>
  );
}