import { motion } from 'framer-motion';

interface PlaceholderProps {
  size?: 'small' | 'medium' | 'large';
  delay?: number;
}

export function Placeholder({ size = 'medium', delay = 0 }: PlaceholderProps) {
  const sizes = {
    small: 'w-24 h-24',
    medium: 'w-32 h-32',
    large: 'w-40 h-40',
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className={`${sizes[size]} bg-gray-200 rounded-lg overflow-hidden relative`}
    >
      <svg
        className="absolute inset-0 w-full h-full text-gray-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 100 100"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M20 50 L80 50 M50 20 L50 80"
        />
      </svg>
    </motion.div>
  );
}