import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from '@/components/layout/bottom-nav';

export const metadata: Metadata = {
  title: 'مشاور تحصیلی من',
  description: 'با «مشاور تحصیلی من»، بهترین مسیر را برای استعدادها و علاقه‌هایتان پیدا کنید.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen flex flex-col h-full bg-background")}>
        <main className="flex-grow flex flex-col pb-20">{children}</main>
        <BottomNav />
        <Toaster />
      </body>
    </html>
  );
}
