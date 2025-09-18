'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Sparkles } from 'lucide-react';

export function LoadingLogo() {
  return (
    <div className="flex items-center justify-center gap-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{
          duration: 0.7,
          ease: 'easeOut',
        }}
        className="relative"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <GraduationCap className="h-24 w-24 text-primary" strokeWidth={1.5} />
        </motion.div>
        <motion.div
            className="absolute -top-2 -right-2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
        >
            <Sparkles className="h-8 w-8 text-primary/80" strokeWidth={2} />
        </motion.div>
      </motion.div>
      <motion.p
         initial={{ y: 10, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ delay: 0.2, duration: 0.5 }}
         className="text-lg text-muted-foreground"
      >
        در حال آماده‌سازی...
      </motion.p>
    </div>
  );
}
