'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Tab = 'home' | 'advisor' | 'alignment' | 'q-and-a';

interface TabsContextType {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function TabsProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
}
