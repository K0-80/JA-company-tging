import { motion } from 'framer-motion';

interface QuoteDisplayProps {
  title: string;
  quote: string;
}

export function QuoteDisplay({ title, quote }: QuoteDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-6xl font-sue-ellen text-primary-steel mb-6"
      >
        {title}
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-sue-ellen text-3xl text-primary-teal max-w-md mx-auto"
      >
        {quote}
      </motion.p>
    </motion.div>
  );
}