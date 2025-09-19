import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from '@/components/layout/bottom-nav';
import { TabsProvider } from '@/context/tabs-provider';
import { TabsContainer } from '@/components/layout/tabs-container';
import { AuthProvider } from '@/context/auth-provider';
import { ConstellationBackground } from '@/components/layout/constellation-background';
import { ThemeProvider } from '@/context/theme-provider';

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
    <html lang="fa" dir="rtl" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen flex flex-col h-full bg-[#030712] relative")}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
            <ConstellationBackground />
            <AuthProvider>
                <TabsProvider>
                    <main className="flex-grow flex flex-col pb-24 z-10 bg-transparent">
                        <TabsContainer />
                    </main>
                    <BottomNav />
                </TabsProvider>
            </AuthProvider>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
