'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Sparkles } from "lucide-react";
import { useTabs } from "@/context/tabs-provider";

export function HomePageContent() {
    const { setActiveTab } = useTabs();
    const heroImage = PlaceHolderImages.find(p => p.id === 'hero-student');

  return (
    <div className="w-full">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
             {heroImage && (
                <div className="relative mx-auto aspect-video overflow-hidden rounded-xl sm:w-full lg:order-last">
                    <Image
                    alt="دانش‌آموز در حال تحصیل"
                    className="object-cover"
                    src={heroImage.imageUrl}
                    data-ai-hint={heroImage.imageHint}
                    fill
                    />
                </div>
            )}
            <div className="flex flex-col justify-center space-y-4 text-center lg:text-right">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                  آینده تحصیلی خود را هوشمندانه بسازید
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0">
                  با «مشاور تحصیلی من»، بهترین مسیر را برای استعدادها و علاقه‌هایتان پیدا کنید. ما با استفاده از هوش مصنوعی به شما کمک می‌کنیم تا بهترین انتخاب را داشته باشید.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-end">
                <Button onClick={() => setActiveTab('advisor')} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Sparkles className="ml-2 h-5 w-5" />
                    شروع مشاوره
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
