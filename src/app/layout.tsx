import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from '@/components/layout/bottom-nav';
import { TabsProvider } from '@/context/tabs-provider';
import { TabsContainer } from '@/components/layout/tabs-container';

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
    <html lang="fa" dir="rtl" className="h-full dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen flex flex-col h-full bg-background")}>
        <TabsProvider>
            <main className="flex-grow flex flex-col pb-20">
                <TabsContainer />
            </main>
            <BottomNav />
        </TabsProvider>
        <Toaster />
      </body>
    </html>
  );
}
