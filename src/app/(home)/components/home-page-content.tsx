'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Sparkles, BrainCircuit, Target, MessagesSquare, ArrowLeft, Loader2, FileText, Library } from "lucide-react";
import { useTabs } from "@/context/tabs-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getArticles, type Article } from "@/services/article-service";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

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
        name: "سارا احمدی",
        major: "دانش‌آموز دوازدهم تجربی",
        text: "این برنامه واقعاً چشم من را به روی رشته‌هایی باز کرد که هرگز به آن‌ها فکر نکرده بودم. تحلیل‌هایش بسیار دقیق و شخصی‌سازی شده بود.",
    },
    {
        id: 'testimonial-2',
        name: "علی رضایی",
        major: "دانش‌آموز یازدهم ریاضی",
        text: "قبلاً بین چند رشته مهندسی شک داشتم. بخش تحلیل اهداف به من کمک کرد تا با اطمینان بیشتری مهندسی کامپیوتر را انتخاب کنم.",
    },
    {
        id: 'testimonial-3',
        name: "مریم حسینی",
        major: "فارغ‌التحصیل هنر",
        text: "کاش وقتی دبیرستانی بودم چنین ابزاری وجود داشت! بخش پرسش و پاسخ برای رفع ابهامات و شناخت مسیر شغلی فوق‌العاده است.",
    }
]

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

function AnimatedSection({ children, className }: { children: React.ReactNode, className?: string }) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    return (
        <motion.section
            ref={ref}
            variants={sectionVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className={className}
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
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    
    return (
        <motion.section 
            ref={ref}
            variants={sectionVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="w-full py-16 md:py-24 bg-muted/30">
            <div className="container">
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
                >
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">صدای دانش‌آموزان مثل شما</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                        ببینید دیگران چگونه از «مشاور تحصیلی من» برای پیدا کردن مسیرشان استفاده کرده‌اند.
                    </p>
                </motion.div>
                <div className="grid gap-8 lg:grid-cols-3">
                    {testimonials.map((testimonial) => {
                        const image = PlaceHolderImages.find(p => p.id === testimonial.id);
                        return (
                            <motion.div
                                key={testimonial.id}
                                variants={itemVariants}
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
            </div>
        </motion.section>
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
      <section ref={heroRef} className="w-full py-20 md:py-32 lg:py-40 relative text-white">
        {heroImage && (
            <Image
                alt="دانش‌آموز در حال تحصیل"
                className="object-cover -z-20"
                src={heroImage.imageUrl}
                data-ai-hint={heroImage.imageHint}
                fill
                priority
            />
        )}
        <div className="absolute inset-0 bg-black/60 -z-10" />
        <div className="container relative">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 50 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-white">
                آینده تحصیلی خود را هوشمندانه بسازید
              </h1>
              <p className="max-w-[700px] text-gray-200 md:text-xl mx-auto">
                با «مشاور تحصیلی من»، بهترین مسیر را برای استعدادها و علاقه‌هایتان پیدا کنید. ما با استفاده از هوش مصنوعی به شما کمک می‌کنیم تا بهترین انتخاب را داشته باشید.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
              <Button onClick={() => setActiveTab('advisor')} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Sparkles className="ml-2 h-5 w-5" />
                  شروع مشاوره رایگان
              </Button>
                <Button onClick={() => setActiveTab('q-and-a')} size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                  پرسیدن سوال
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <AnimatedSection className="w-full py-16 md:py-24">
          <div className="container">
              <motion.div variants={itemVariants} className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">ابزارهای شما برای یک انتخاب آگاهانه</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      ما سه ابزار قدرتمند را در اختیار شما قرار می‌دهیم تا با اطمینان کامل مسیر آینده خود را انتخاب کنید.
                  </p>
              </motion.div>
              <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
                  {features.map((feature, index) => (
                      <motion.div key={index} variants={itemVariants}>
                        <Card className="bg-transparent border-0 shadow-none hover:-translate-y-2 transition-transform duration-300">
                            <CardHeader className="flex flex-col items-center text-center gap-4">
                                <div className="p-4 bg-primary/10 rounded-full">{feature.icon}</div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                      </motion.div>
                  ))}
              </div>
          </div>
      </AnimatedSection>
      
      {/* How it works */}
      <AnimatedSection className="w-full py-16 md:py-24">
        <div className="container">
           <motion.div variants={itemVariants} className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">فقط در ۳ مرحله ساده</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    فرآیند کشف مسیر تحصیلی شما هرگز به این سادگی نبوده است.
                </p>
            </motion.div>
            <div className="relative grid gap-10 lg:grid-cols-3">

                <motion.div variants={itemVariants} className="relative flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl border-4 border-card z-10">1</div>
                    <h3 className="mt-6 text-xl font-bold">پاسخ به سوالات</h3>
                    <p className="mt-2 text-muted-foreground">به سوالات چندمرحله‌ای ما در مورد علایق، نمرات و اهدافتان پاسخ دهید.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="relative flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl border-4 border-card z-10">2</div>
                    <h3 className="mt-6 text-xl font-bold">تحلیل هوشمند</h3>
                    <p className="mt-2 text-muted-foreground">هوش مصنوعی ما پاسخ‌های شما را تحلیل کرده و لیستی از رشته‌های مناسب را پیشنهاد می‌دهد.</p>
                </motion.div>
                <motion.div variants={itemVariants} className="relative flex flex-col items-center text-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl border-4 border-card z-10">3</div>
                    <h3 className="mt-6 text-xl font-bold">دریافت نتایج</h3>
                    <p className="mt-2 text-muted-foreground">نقاط قوت، ضعف، فرصت‌های شغلی و مسیر آینده هر رشته را به تفکیک مشاهده کنید.</p>
                </motion.div>
            </div>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Articles Section */}
       <AnimatedSection className="w-full py-16 md:py-24">
        <div className="container">
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mb-12">
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
            </motion.div>
            {isLoading ? (
                 <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : articles.length === 0 ? (
                <motion.div variants={itemVariants} className="text-center py-16 px-4 border-2 border-dashed rounded-lg bg-card">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">مقاله‌ای برای نمایش وجود ندارد</h3>
                    <p className="mt-2 text-sm text-muted-foreground">به نظر می‌رسد هنوز مقاله‌ای در پایگاه داده ذخیره نشده است.</p>
                </motion.div>
            ) : (
                <div className="space-y-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {articles.slice(0, 3).map((article, index) => {
                             const imageId = `article-${(index % 3) + 1}`;
                             const image = PlaceHolderImages.find(p => p.id === imageId);
                             return (
                                <motion.div key={article.id} variants={itemVariants}>
                                    <ArticleCard article={article} image={image} />
                                </motion.div>
                             )
                        })}
                    </div>
                </div>
            )}
        </div>
       </AnimatedSection>

      {/* Final CTA */}
      <AnimatedSection className="w-full py-16 md:py-24 pb-32">
        <div className="container">
            <motion.div variants={itemVariants} className="rounded-xl bg-primary/10 p-8 md:p-12 lg:p-16 border border-primary/20">
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
            </motion.div>
        </div>
      </AnimatedSection>

    </div>
  );
}
