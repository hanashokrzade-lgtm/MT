'use client';

import Link from 'next/link';
import { Home, ClipboardList, BarChartHorizontalBig, Mic } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'خانه', icon: Home },
  { href: '/advisor', label: 'مشاوره', icon: ClipboardList },
  { href: '/alignment', label: 'تحلیل اهداف', icon: BarChartHorizontalBig },
  { href: '/q-and-a', label: 'پرسش و پاسخ', icon: Mic },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
      <nav className="container mx-auto flex items-center justify-around h-20">
          {navLinks.map((link) => {
            const isActive = (pathname === '/' && link.href === '/') || (pathname !== '/' && link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center justify-center text-center w-20 h-full transition-colors duration-200 ease-in-out',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <div className={cn(
                    'p-3 rounded-full transition-colors',
                    isActive ? 'bg-primary/10' : ''
                )}>
                    <link.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium mt-1">{link.label}</span>
              </Link>
            )
          })}
        </nav>
    </div>
  );
}
