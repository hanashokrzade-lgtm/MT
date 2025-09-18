'use client';

import { useTabs } from '@/context/tabs-provider';
import { HomePageContent } from '@/app/(home)/components/home-page-content';
import { AdvisorPageContent } from '@/app/advisor/components/advisor-page-content';
import { AlignmentPageContent } from '@/app/alignment/components/alignment-page-content';
import { QaPageContent } from '@/app/q-and-a/components/qa-page-content';

export function TabsContainer() {
  const { activeTab } = useTabs();

  return (
    <>
      {activeTab === 'home' && <HomePageContent />}
      {activeTab === 'advisor' && <AdvisorPageContent />}
      {activeTab === 'alignment' && <AlignmentPageContent />}
      {activeTab === 'q-and-a' && <QaPageContent />}
    </>
  );
}
