'use client';

import { Home, ClipboardList, BarChartHorizontalBig, Mic, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTabs } from '@/context/tabs-provider';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-provider';

const navLinks = [
  { id: 'home', label: 'خانه', icon: Home },
  { id: 'advisor', label: 'مشاوره', icon: ClipboardList },
  { id: 'alignment', label: 'تحلیل اهداف', icon: BarChartHorizontalBig },
  { id: 'q-and-a', label: 'پرسش و پاسخ', icon: Mic },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useTabs();
  const { user } = useAuth();
  const isProfileActive = activeTab === 'profile';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-24 bg-transparent">
        <div className="absolute bottom-0 left-0 right-0 h-20 glass-nav"></div>
        <nav className="container relative mx-auto flex h-full items-center justify-around">
            <div className="flex w-full items-center justify-around">
                {navLinks.slice(0, 2).map((link) => {
                    const isActive = activeTab === link.id;
                    return (
                        <NavItem key={link.id} isActive={isActive} onClick={() => setActiveTab(link.id)} {...link} />
                    );
                })}
            </div>

            <div className="relative z-10 -mx-4">
                <motion.button
                    onClick={() => setActiveTab('profile')}
                    whileTap={{ scale: 0.95 }}
                    className="group relative flex h-20 w-20 flex-col items-center justify-center"
                    style={{ bottom: '1rem' }}
                >
                    <div className={cn(
                        "relative flex h-full w-full items-center justify-center rounded-full border-4 border-background bg-card p-1 shadow-lg transition-all duration-300 group-hover:bg-card/80",
                        isProfileActive && "shadow-primary/30 shadow-[0_0_20px]"
                    )}>
                        <Avatar className="h-full w-full border-2 border-primary/20 transition-all group-hover:border-primary/50">
                           {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User Avatar'} />}
                           <AvatarFallback>
                               <User className="h-8 w-8 text-muted-foreground" />
                           </AvatarFallback>
                        </Avatar>
                         {isProfileActive && (
                            <motion.div
                            layoutId="active-indicator-background"
                            className="absolute inset-0 z-[-1] rounded-full border-2 border-primary bg-primary/20"
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            />
                        )}
                    </div>
                </motion.button>
            </div>

            <div className="flex w-full items-center justify-around">
                {navLinks.slice(2, 4).map((link) => {
                    const isActive = activeTab === link.id;
                    return (
                        <NavItem key={link.id} isActive={isActive} onClick={() => setActiveTab(link.id)} {...link} />
                    );
                })}
            </div>
        </nav>
    </div>
  );
}

const NavItem = ({ isActive, onClick, icon: Icon, label }: {isActive: boolean, onClick:() => void, icon: React.ElementType, label: string}) => {
    return (
        <motion.button
            onClick={onClick}
            className={cn(
              'relative flex h-full w-20 flex-col items-center justify-center text-center transition-colors duration-200 ease-in-out',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <div className="relative">
               <div className="relative p-3">
                 {isActive && (
                    <motion.div
                      layoutId="active-indicator-background"
                      className="absolute inset-0 rounded-full bg-primary/10"
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}
                  <div className="relative z-10">
                      <Icon className="h-6 w-6" />
                  </div>
              </div>
            </div>
            <span className="text-xs font-medium">{label}</span>
          </motion.button>
    )
}
