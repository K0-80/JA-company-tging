import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header';
import { LoadingScreen } from './components/LoadingScreen';
import { ChatBar } from './components/ChatBar';
import FluidSimulation from './components/FluidSimulation';

//seems to be lag spike upon site loading the loading screen might have  some issues

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const quotes = [
    "The best way to predict the future is to create it.",
    "Believe you can and you're halfway there.",
    "You are never too old to set another goal or to dream a new dream.",
    "The only limit to our realization of tomorrow will be our doubts of today.",
    "Act as if what you do makes a difference. It does.",
    "Success is not the key to happiness. Happiness is the key to success.",
    "Keep your face always toward the sunshine—and shadows will fall behind you.",
    "The only way to do great work is to love what you do.",
    "You are braver than you believe, stronger than you seem, and smarter than you think.",
    "Happiness is not something ready-made. It comes from your own actions."
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="fixed inset-0 z-0">
        <FluidSimulation />
      </div>

      <div className="h-screen overflow-hidden">
        <Header />
        
        <main className="h-full pt-24 px-4 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center max-w-screen-xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-8xl font-sue-ellen text-primary-moss mb-4"
              >
                Slimo
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-sue-ellen text-3xl text-primary-verdigris max-w-md mx-auto"
              >
                {randomQuote}
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
    </div>
  );
}