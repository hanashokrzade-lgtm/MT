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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="container max-w-lg mx-auto p-2">
        <nav className="flex items-center justify-around bg-card border border-border shadow-lg rounded-full p-2">
          {navLinks.map((link) => {
            const isActive = (pathname === '/' && link.href === '/') || (pathname !== '/' && link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center justify-center text-center w-16 h-16 rounded-full transition-colors duration-300 ease-in-out',
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <link.icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  );
}
