'use client';

import { useTabs } from '@/context/tabs-provider';
import { HomePageContent } from '@/app/(home)/components/home-page-content';
import { AdvisorPageContent } from '@/app/advisor/components/advisor-page-content';
import { AlignmentPageContent } from '@/app/alignment/components/alignment-page-content';
import { QaPageContent } from '@/app/q-and-a/components/qa-page-content';
import { motion, AnimatePresence } from 'framer-motion';

const pages: { [key: string]: React.ComponentType } = {
  home: HomePageContent,
  advisor: AdvisorPageContent,
  alignment: AlignmentPageContent,
  'q-and-a': QaPageContent,
};

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 30 : -30,
    opacity: 0,
    scale: 0.98,
  }),
};

export function TabsContainer() {
  const { activeTab, direction } = useTabs();
  const PageComponent = pages[activeTab];

  return (
    <div className="flex-grow flex flex-col overflow-hidden relative">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={activeTab}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 },
          }}
          className="absolute top-0 left-0 w-full h-full"
        >
          <div className="h-full w-full overflow-y-auto">
            {PageComponent && <PageComponent />}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
