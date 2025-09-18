'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

type Tab = 'home' | 'advisor' | 'alignment' | 'q-and-a' | 'profile';

const tabOrder: Tab[] = ['home', 'advisor', 'profile', 'alignment', 'q-and-a'];

interface TabsContextType {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  direction: number;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function TabsProvider({ children }: { children: ReactNode }) {
  const [tabState, setTabState] = useState<{tab: Tab, dir: number}>({ tab: 'home', dir: 0 });

  const activeTab = tabState.tab;
  const direction = tabState.dir;

  const setActiveTab = (newTab: Tab) => {
    const currentIndex = tabOrder.indexOf(activeTab);
    const newIndex = tabOrder.indexOf(newTab);
    const newDirection = newIndex > currentIndex ? 1 : -1;
    setTabState({ tab: newTab, dir: newDirection });
  };
  
  const value = useMemo(() => ({ activeTab, setActiveTab, direction }), [activeTab, direction]);

  return (
    <TabsContext.Provider value={value}>
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
