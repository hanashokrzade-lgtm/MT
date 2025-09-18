'use client';

import { Home, ClipboardList, BarChartHorizontalBig, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTabs } from '@/context/tabs-provider';
import { motion } from 'framer-motion';

const navLinks = [
  { id: 'home', label: 'خانه', icon: Home },
  { id: 'advisor', label: 'مشاوره', icon: ClipboardList },
  { id: 'alignment', label: 'تحلیل اهداف', icon: BarChartHorizontalBig },
  { id: 'q-and-a', label: 'پرسش و پاسخ', icon: Mic },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useTabs();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <nav className="container mx-auto flex items-center justify-around h-20">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <motion.button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={cn(
                  'flex flex-col items-center justify-center text-center w-20 h-full transition-colors duration-200 ease-in-out relative',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <div className="relative">
                  <div className={cn(
                      'p-3 rounded-full transition-colors',
                      isActive ? 'bg-primary/10' : ''
                  )}>
                      <link.icon className="h-6 w-6" />
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-primary"
                    />
                  )}
                </div>
                <span className="text-xs font-medium mt-1">{link.label}</span>
              </motion.button>
            )
          })}
        </nav>
    </div>
  );
}
