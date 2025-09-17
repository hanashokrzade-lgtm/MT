'use client';

import Link from 'next/link';
import { GraduationCap, Home, ClipboardList, BarChartHorizontalBig, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from 'react';


const navLinks = [
  { href: '/', label: 'خانه', icon: Home },
  { href: '/advisor', label: 'مشاوره', icon: ClipboardList },
  { href: '/alignment', label: 'تحلیل اهداف', icon: BarChartHorizontalBig },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const NavLinkItems = () => navLinks.map((link) => (
    <Button
      key={link.href}
      variant="ghost"
      asChild
      className={cn(
        'justify-start',
        pathname === link.href ? 'bg-primary/20 text-primary-foreground' : ''
      )}
      onClick={() => setSheetOpen(false)}
    >
      <Link href={link.href} className="flex items-center gap-2">
        <link.icon className="h-5 w-5" />
        {link.label}
      </Link>
    </Button>
  ));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <GraduationCap className="h-7 w-7 text-primary" />
          <span>مشاور تحصیلی من</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant={pathname === link.href ? 'secondary' : 'ghost'}
              asChild
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>
        <div className="md:hidden">
           <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">باز کردن منو</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>
                        <Link href="/" className="flex items-center gap-2 font-bold text-lg" onClick={() => setSheetOpen(false)}>
                            <GraduationCap className="h-7 w-7 text-primary" />
                            <span>مشاور تحصیلی من</span>
                        </Link>
                    </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  <NavLinkItems />
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
