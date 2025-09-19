'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Sparkles, BrainCircuit, Target, MessagesSquare, ArrowLeft, Loader2, FileText, Library, Volume2, Pause } from "lucide-react";
import { useTabs } from "@/context/tabs-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getArticles, type Article } from "@/services/article-service";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { generateMultivoiceAudio } from "@/ai/flows/generate-multivoice-audio";

const features = [
    {
        icon: <BrainCircuit className="h-8 w-8 text-primary" />,
        title: "مشاوره هوشمند",
        description: "با پاسخ به چند سوال، هوش مصنوعی ما بهترین رشته‌ها را بر اساس شخصیت، علایق و توانایی‌های شما پیشنهاد می‌دهد.",
    },
    {
        icon: <Target className="h-8 w-8 text-primary" />,
        title: "تحلیل هم‌راستایی اهداف",
        description: "اهداف شغلی و تحصیلی خود را وارد کنید تا ببینید کدام رشته‌ها بیشترین تطابق را با آینده مورد نظر شما دارند.",
    },
    {
        icon: <MessagesSquare className="h-8 w-8 text-primary" />,
        title: "پرسش و پاسخ آنی",
        description: "هر سوالی در مورد رشته‌ها، دانشگاه‌ها یا بازار کار دارید، از مشاور هوش مصنوعی ما بپرسید و پاسخ فوری دریافت کنید.",
    },
];

const testimonials = [
    {
        id: 'testimonial-1',
        speakerId: 'Speaker1',
        voice: 'Achernar',
        name: "سارا احمدی",
        major: "دانش‌آموز دوازدهم تجربی",
        text: "این برنامه واقعاً چشم من را به روی رشته‌هایی باز کرد که هرگز به آن‌ها فکر نکرده بودم. تحلیل‌هایش بسیار دقیق و شخصی‌سازی شده بود.",
    },
    {
        id: 'testimonial-2',
        speakerId: 'Speaker2',
        voice: 'Sirius',
        name: "علی رضایی",
        major: "دانش‌آموز یازدهم ریاضی",
        text: "قبلاً بین چند رشته مهندسی شک داشتم. بخش تحلیل اهداف به من کمک کرد تا با اطمینان بیشتری مهندسی کامپیوتر را انتخاب کنم.",
    },
    {
        id: 'testimonial-3',
        speakerId: 'Speaker3',
        voice: 'Vega',
        name: "مریم حسینی",
        major: "فارغ‌التحصیل هنر",
        text: "کاش وقتی دبیرستانی بودم چنین ابزاری وجود داشت! بخش پرسش و پاسخ برای رفع ابهامات و شناخت مسیر شغلی فوق‌العاده است.",
    }
]

function AnimatedSection({ children }: { children: React.ReactNode }) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full py-16 md:py-24"
        >
            {children}
        </motion.section>
    );
}

function ArticleCard({ article, image }: { article: Article, image?: typeof PlaceHolderImages[0] }) {
    const ArticleContent = () => (
         <>
            <DialogHeader className="text-right">
                <Badge variant="secondary" className="w-fit mb-2">{article.category}</Badge>
                <DialogTitle className="text-2xl">{article.title}</DialogTitle>
                <DialogDescription>{article.description}</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-6 -mr-6 mt-4">
                <div className="prose prose-sm dark:prose-invert text-foreground/90 leading-relaxed text-right whitespace-pre-wrap">
                    {article.content}
                </div>
            </ScrollArea>
        </>
    );

    return (
        <ResponsiveDialog
            trigger={
                 <Card className="overflow-hidden group cursor-pointer hover:shadow-primary/10 hover:shadow-lg transition-shadow h-full flex flex-col">
                    {image && (
                        <div className="relative aspect-video overflow-hidden">
                            <Image
                                src={image.imageUrl}
                                alt={article.title}
                                data-ai-hint={image.imageHint}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    )}
                    <CardHeader>
                        <Badge variant="secondary" className="w-fit mb-2">{article.category}</Badge>
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <CardDescription>{article.description}</CardDescription>
                    </CardContent>
                </Card>
            }
            dialogContent={
                <DialogContent className="sm:max-w-2xl">
                    <ArticleContent />
                </DialogContent>
            }
            drawerContent={
                <DrawerContent>
                     <div className="p-4 pt-0">
                         <ArticleContent />
                     </div>
                </DrawerContent>
            }
        />
    );
}

function TestimonialsSection() {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
    const [audioLoading, setAudioLoading] = useState(false);
    const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const { toast } = useToast();

    const handlePlayAudio = async () => {
        if (audioDataUri) {
            if (audioRef.current) {
                if (isPlaying) {
                    audioRef.current.pause();
                } else {
                    audioRef.current.play();
                }
            }
            return;
        }

        setAudioLoading(true);
        try {
            const script = testimonials.map(t => `${t.speakerId}: ${t.name} گفت: ${t.text}`).join(' ');
            const speakers = testimonials.map(t => ({ speaker: t.speakerId, voice: t.voice as "Algenib" | "Achernar" | "Sirius" | "Vega" }));
            
            const response = await generateMultivoiceAudio({ speakers, script });
            setAudioDataUri(response.audioDataUri);
        } catch (error: any) {
            toast({
                title: 'خطا در تولید صدا',
                description: `مشکلی در تولید فایل صوتی پیش آمد: ${error.message}`,
                variant: 'destructive',
            });
        } finally {
            setAudioLoading(false);
        }
    };
    
    useEffect(() => {
        const audio = audioRef.current;
        if (audioDataUri && audio) {
            audio.src = audioDataUri;
            audio.play();
        }
    }, [audioDataUri]);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);

      return () => {
          audio.removeEventListener('play', handlePlay);
          audio.removeEventListener('pause', handlePause);
          audio.removeEventListener('ended', handleEnded);
      }
  }, []);

    return (
        <section ref={ref} className="w-full py-16 md:py-24 bg-muted/30">
            <div className="container px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
                >
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">صدای دانش‌آموزان مثل شما</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                        ببینید دیگران چگونه از «مشاور تحصیلی من» برای پیدا کردن مسیرشان استفاده کرده‌اند.
                    </p>
                </motion.div>
                <div className="grid gap-8 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => {
                        const image = PlaceHolderImages.find(p => p.id === testimonial.id);
                        return (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 50 }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            >
                                <Card className="flex flex-col h-full bg-card">
                                    <CardContent className="p-6 flex-grow">
                                        <p className="text-muted-foreground">"{testimonial.text}"</p>
                                    </CardContent>
                                    <CardHeader className="flex-row gap-4 items-center pt-0">
                                        {image && (
                                            <Avatar>
                                                <AvatarImage src={image.imageUrl} alt={testimonial.name} data-ai-hint={image.imageHint} />
                                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div>
                                            <h4 className="font-semibold">{testimonial.name}</h4>
                                            <p className="text-sm text-muted-foreground">{testimonial.major}</p>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: inView ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex justify-center mt-12">
                    <Button onClick={handlePlayAudio} size="lg" variant="outline" disabled={audioLoading}>
                        {audioLoading ? (
                            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                        ) : isPlaying ? (
                            <Pause className="ml-2 h-5 w-5" />
                        ) : (
                            <Volume2 className="ml-2 h-5 w-5" />
                        )}
                        {isPlaying ? 'توقف' : (audioDataUri ? 'پخش مجدد نظرات' : 'شنیدن نظرات')}
                    </Button>
                    <audio ref={audioRef} className="hidden" />
                </motion.div>
            </div>
        </section>
    )
}

export function HomePageContent() {
    const { setActiveTab } = useTabs();
    const heroImage = PlaceHolderImages.find(p => p.id === 'hero-student-2');
    const { toast } = useToast();
    const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.3 });


    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                const fetchedArticles = await getArticles();
                setArticles(fetchedArticles);
            } catch (error) {
                console.error("Failed to fetch articles:", error);
                toast({
                    title: "خطا در بارگذاری مقالات",
                    description: "مشکلی در دریافت لیست مقالات پیش آمده است.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, [toast]);


  return (
    <div className="w-full relative">
      {/* Hero Section */}
      <section ref={heroRef} className="w-full py-12 md:py-24 lg:py-32 relative">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
             <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: heroInView ? 1 : 0, scale: heroInView ? 1 : 0.9 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="relative mx-auto aspect-video overflow-hidden rounded-xl sm:w-full lg:order-last">
                 {heroImage && (
                    <Image
                    alt="دانش‌آموز در حال تحصیل"
                    className="object-cover rounded-xl shadow-2xl"
                    src={heroImage.imageUrl}
                    data-ai-hint={heroImage.imageHint}
                    fill
                    />
                )}
            </motion.div>
            <div className="flex flex-col justify-center space-y-4 text-center lg:text-right">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: heroInView ? 1 : 0, x: heroInView ? 0 : 50 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                  آینده تحصیلی خود را هوشمندانه بسازید
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0">
                  با «مشاور تحصیلی من»، بهترین مسیر را برای استعدادها و علاقه‌هایتان پیدا کنید. ما با استفاده از هوش مصنوعی به شما کمک می‌کنیم تا بهترین انتخاب را داشته باشید.
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
                transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-end">
                <Button onClick={() => setActiveTab('advisor')} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Sparkles className="ml-2 h-5 w-5" />
                    شروع مشاوره رایگان
                </Button>
                 <Button onClick={() => setActiveTab('q-and-a')} size="lg" variant="outline">
                    پرسیدن سوال
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <AnimatedSection>
          <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">ابزارهای شما برای یک انتخاب آگاهانه</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      ما سه ابزار قدرتمند را در اختیار شما قرار می‌دهیم تا با اطمینان کامل مسیر آینده خود را انتخاب کنید.
                  </p>
              </div>
              <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
                  {features.map((feature, index) => (
                      <Card key={index} className="bg-transparent border-0 shadow-none hover:-translate-y-2 transition-transform duration-300">
                          <CardHeader className="flex flex-col items-center text-center gap-4">
                              <div className="p-4 bg-primary/10 rounded-full">{feature.icon}</div>
                              <CardTitle>{feature.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="text-center">
                              <p className="text-muted-foreground">{feature.description}</p>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          </div>
      </AnimatedSection>
      
      {/* How it works */}
      <AnimatedSection>
        <div className="container px-4 md:px-6">
           <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">فقط در ۳ مرحله ساده</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    فرآیند کشف مسیر تحصیلی شما هرگز به این سادگی نبوده است.
                </p>
            </div>
            <div className="relative grid gap-10 lg:grid-cols-3">
                 <div className="absolute top-1/2 left-0 w-full h-px bg-border -translate-y-1/2 hidden lg:block"></div>
                 <div className="absolute top-0 left-1/2 w-px h-full bg-border -translate-x-1/2 lg:hidden"></div>

                <div className="relative flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl border-4 border-card z-10">1</div>
                    <h3 className="mt-6 text-xl font-bold">پاسخ به سوالات</h3>
                    <p className="mt-2 text-muted-foreground">به سوالات چندمرحله‌ای ما در مورد علایق، نمرات و اهدافتان پاسخ دهید.</p>
                </div>
                <div className="relative flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl border-4 border-card z-10">2</div>
                    <h3 className="mt-6 text-xl font-bold">تحلیل هوشمند</h3>
                    <p className="mt-2 text-muted-foreground">هوش مصنوعی ما پاسخ‌های شما را تحلیل کرده و لیستی از رشته‌های مناسب را پیشنهاد می‌دهد.</p>
                </div>
                <div className="relative flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl border-4 border-card z-10">3</div>
                    <h3 className="mt-6 text-xl font-bold">دریافت نتایج</h3>
                    <p className="mt-2 text-muted-foreground">نقاط قوت، ضعف، فرصت‌های شغلی و مسیر آینده هر رشته را به تفکیک مشاهده کنید.</p>
                </div>
            </div>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Articles Section */}
       <AnimatedSection>
        <div className="container px-4 md:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mb-12">
                <div className="text-center sm:text-right">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">مقالات</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                        دانش خود را با مقالات تولید شده توسط هوش مصنوعی افزایش دهید.
                    </p>
                </div>
                {articles.length > 0 && (
                    <div className="text-center">
                        <ResponsiveDialog
                             trigger={
                                 <Button size="lg" variant="outline">
                                    <Library className="ml-2 h-5 w-5" />
                                    مشاهده همه مقالات
                                </Button>
                             }
                             dialogContent={
                                 <DialogContent className="sm:max-w-4xl">
                                     <DialogHeader className="text-right">
                                        <DialogTitle className="text-2xl">آرشیو مقالات</DialogTitle>
                                        <DialogDescription>تمام مقالات تولید شده را در اینجا مرور کنید.</DialogDescription>
                                    </DialogHeader>
                                    <ScrollArea className="max-h-[70vh] p-1">
                                        <div className="grid gap-6 py-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {articles.map((article, index) => {
                                                const imageId = `article-${(index % 3) + 1}`;
                                                const image = PlaceHolderImages.find(p => p.id === imageId);
                                                return (
                                                    <ArticleCard key={article.id} article={article} image={image} />
                                                )
                                            })}
                                        </div>
                                    </ScrollArea>
                                 </DialogContent>
                             }
                             drawerContent={
                                 <DrawerContent>
                                     <DrawerHeader className="text-right">
                                        <DrawerTitle className="text-2xl">آرشیو مقالات</DrawerTitle>
                                        <DialogDescription>تمام مقالات تولید شده را در اینجا مرور کنید.</DialogDescription>
                                    </DrawerHeader>
                                    <div className="p-4 pt-0">
                                         <ScrollArea className="h-[70vh]">
                                             <div className="grid gap-6 py-4 grid-cols-1">
                                                 {articles.map((article, index) => {
                                                     const imageId = `article-${(index % 3) + 1}`;
                                                     const image = PlaceHolderImages.find(p => p.id === imageId);
                                                     return (
                                                         <ArticleCard key={article.id} article={article} image={image} />
                                                     )
                                                 })}
                                             </div>
                                         </ScrollArea>
                                     </div>
                                 </DrawerContent>
                             }
                        />
                    </div>
                )}
            </div>
            {isLoading ? (
                 <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : articles.length === 0 ? (
                <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg bg-card">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">مقاله‌ای برای نمایش وجود ندارد</h3>
                    <p className="mt-2 text-sm text-muted-foreground">به نظر می‌رسد هنوز مقاله‌ای در پایگاه داده ذخیره نشده است.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {articles.slice(0, 3).map((article, index) => {
                             const imageId = `article-${(index % 3) + 1}`;
                             const image = PlaceHolderImages.find(p => p.id === imageId);
                             return (
                                <ArticleCard key={article.id} article={article} image={image} />
                             )
                        })}
                    </div>
                </div>
            )}
        </div>
       </AnimatedSection>

      {/* Final CTA */}
      <AnimatedSection>
        <div className="container">
            <div className="rounded-xl bg-primary/10 p-8 md:p-12 lg:p-16 border border-primary/20">
                <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                    <div className="space-y-4 text-center lg:text-right">
                        <h2 className="text-3xl font-bold tracking-tighter text-primary font-headline">
                            آماده‌اید مسیرتان را پیدا کنید؟
                        </h2>
                        <p className="text-foreground/80">
                            همین حالا اولین مشاوره هوشمند خود را شروع کنید و قدم اول را برای ساختن آینده‌ای درخشان بردارید. این فرآیند سریع، ساده و کاملاً رایگان است.
                        </p>
                    </div>
                    <div className="flex justify-center lg:justify-end">
                        <Button onClick={() => setActiveTab('advisor')} size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-7 px-10">
                            شروع می‌کنم
                            <ArrowLeft className="mr-3 h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
      </AnimatedSection>

    </div>
  );
}
