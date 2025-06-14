// components/Footer.tsx
import { motion } from 'framer-motion';
import { FiInstagram, FiMail, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <motion.footer 
      className="py-10 bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 mt-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 text-transparent bg-clip-text">
              Stock Vision
            </h3>
            <p className="mt-3 text-gray-400">
              Advanced market analytics platform providing real-time data, 
              technical indicators, and financial insights for informed trading decisions.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Real-time Quotes</li>
              <li>OHLC Dashboard</li>
              <li>Market News</li>
              <li>Technical Analysis</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/_jagjeet_singh_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram size={20} />
              </a>
              <a 
                href="mailto:contact@jagjeetcoding@gmail.com" 
                className="text-gray-400 hover:text-emerald-400 transition-colors"
                aria-label="Email"
              >
                <FiMail size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/jagjeet-singh-a71aa2251/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={20} />
              </a>
            </div>
            <h4 className="text-lg font-semibold mt-6 mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Disclaimers</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Stock Vision. All rights reserved.</p>
          <p className="mt-2 text-sm">Market data provided for educational purposes only</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;