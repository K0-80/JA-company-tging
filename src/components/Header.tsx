import { motion } from 'framer-motion';
import { MessageSquare, User, Settings, Menu } from 'lucide-react';

export function Header() {
  const menuItems = [
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Chat' },
    { icon: <User className="w-5 h-5" />, label: 'Profile' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    { icon: <Menu className="w-5 h-5" />, label: 'Menu' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-10"
    >
      <nav className="max-w-screen-xl mx-auto px-4 py-6">
        <ul className="flex justify-center items-center gap-8">
          {menuItems.map((item, index) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200
                }
              }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="cursor-pointer"
            >
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center gap-2">
                {item.icon}
                <span className="text-sm font-sue-ellen text-gray-600">{item.label}</span>
              </div>
            </motion.li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}