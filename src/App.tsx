import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header';
import { LoadingScreen } from './components/LoadingScreen';
import { ChatBar } from './components/ChatBar';
import { Bot } from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="h-screen overflow-hidden bg-[#f0f2f5]">
      <Header />
      
      <main className="h-full pt-24 px-4 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center max-w-screen-xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-20 h-20 bg-blue-500/90 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg"
            >
              <Bot className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-sue-ellen text-gray-800 mb-4"
            >
              app name here
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-sue-ellen text-xl text-gray-600 max-w-md mx-auto"
            >
              quote of the day or something
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full"
          >
            <ChatBar />
          </motion.div>
        </div>
      </main>
    </div>
  );
}