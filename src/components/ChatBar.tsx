import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useState } from 'react';

export function ChatBar() {
  const [message, setMessage] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div className="flex gap-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hows your day?"
            className="flex-1 bg-transparent border-none outline-none font-sue-ellen text-lg text-gray-700 placeholder-gray-400"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 text-white rounded-xl px-4 py-2 flex items-center gap-2 font-sue-ellen text-lg"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}