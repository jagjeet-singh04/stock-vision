// components/FeatureCard.tsx
import { motion } from 'framer-motion';

const FeatureCard = ({ 
  title, 
  description, 
  color, 
  onSelect 
}: { 
  title: string; 
  description: string; 
  color: string; 
  onSelect: () => void;
}) => {
  return (
    <motion.div
      className={`${color} rounded-2xl p-6 cursor-pointer overflow-hidden shadow-2xl h-full`}
      whileHover={{ scale: 1.03, rotate: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 h-full flex flex-col">
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-gray-200 flex-grow">{description}</p>
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full transition-all">
            Explore →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;