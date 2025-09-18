'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Calculator,
  FlaskConical,
  BookOpen,
  Wrench,
  Paintbrush,
  ThumbsUp,
  ThumbsDown,
  Briefcase,
  GraduationCap,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  Volume2,
  Pause,
} from 'lucide-react';
import {
  analyzeStudentAnswersAndSuggestMajors,
  type AnalyzeStudentAnswersAndSuggestMajorsOutput,
} from '@/ai/flows/analyze-student-answers-and-suggest-majors';
import { generateAudioFromText } from '@/ai/flows/generate-audio-from-text';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  interests: z.string().min(20, { message: 'لطفاً علاقه‌مندی‌های خود را با حداقل ۲۰ کاراکتر شرح دهید.' }),
  grades: z.string().min(10, { message: 'لطفاً نمرات خود را با حداقل ۱۰ کاراکتر وارد کنید.' }),
  strengths: z.string().min(20, { message: 'لطفاً نقاط قوت خود را با حداقل ۲۰ کاراکتر شرح دهید.' }),
  weaknesses: z.string().min(20, { message: 'لطفاً نقاط ضعف خود را با حداقل ۲۰ کاراکتر شرح دهید.' }),
  careerGoals: z.string().min(20, { message: 'لطفاً اهداف شغلی خود را با حداقل ۲۰ کاراکتر بیان کنید.' }),
  familyExpectations: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: 'علاقه‌مندی‌ها', fields: ['interests'] },
  { id: 2, title: 'نمرات تحصیلی', fields: ['grades'] },
  { id: 3, title: 'نقاط قوت و ضعف', fields: ['strengths', 'weaknesses'] },
  { id: 4, title: 'اهداف و انتظارات', fields: ['careerGoals', 'familyExpectations'] },
];

const MajorIcon = ({ major }: { major: string }) => {
  if (major.includes('ریاضی')) return <Calculator className="h-5 w-5 text-accent-foreground" />;
  if (major.includes('تجربی')) return <FlaskConical className="h-5 w-5 text-accent-foreground" />;
  if (major.includes('انسانی')) return <BookOpen className="h-5 w-5 text-accent-foreground" />;
  if (major.includes('فنی') || major.includes('تکنیک')) return <Wrench className="h-5 w-5 text-accent-foreground" />;
  if (major.includes('هنر')) return <Paintbrush className="h-5 w-5 text-accent-foreground" />;
  return <GraduationCap className="h-5 w-5 text-accent-foreground" />;
};

export function AdvisorForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeStudentAnswersAndSuggestMajorsOutput | null>(null);
  const { toast } = useToast();

  const [audioLoading, setAudioLoading] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: '',
      grades: '',
      strengths: '',
      weaknesses: '',
      careerGoals: '',
      familyExpectations: '',
    },
  });

  const handleNext = async () => {
    const fields = steps[step - 1].fields as (keyof FormData)[];
    const output = await form.trigger(fields, { shouldFocus: true });
    if (!output) return;
    if (step < steps.length) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setResult(null);
    setAudioDataUri(null);
    try {
      const response = await analyzeStudentAnswersAndSuggestMajors(data);
      setResult(response);
    } catch (error) {
      toast({
        title: 'خطا در تحلیل',
        description: 'متاسفانه در ارتباط با سرویس هوش مصنوعی مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    form.reset();
    setStep(1);
    setResult(null);
    setAudioDataUri(null);
    setIsPlaying(false);
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
  }

  const handlePlayAudio = async () => {
    if (!result) return;
    if (audioDataUri) {
        if(audioRef.current) {
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
        const fullText = `
            ${result.summary}
            ${result.stepByStepPath}
        `;
        const response = await generateAudioFromText(fullText);
        setAudioDataUri(response.audioDataUri);
    } catch (error: any) {
        const isQuotaError = error.message && error.message.includes('429');
        toast({
            title: 'خطا در تولید صدا',
            description: isQuotaError 
              ? 'متاسفانه سقف استفاده از سرویس صوتی تمام شده است. لطفاً کمی بعد دوباره تلاش کنید.'
              : 'متاسفانه در تولید فایل صوتی مشکلی پیش آمد.',
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


  if (loading) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">در حال تحلیل اطلاعات شما...</p>
        <p className="mt-2 text-sm text-muted-foreground">این فرآیند ممکن است کمی طول بکشد. لطفاً صبور باشید.</p>
      </Card>
    );
  }

  if (result) {
    return (
      <div className="space-y-8">
        <Alert className="bg-accent/30 border-accent">
            <Sparkles className="h-4 w-4" />
            <AlertTitle className="font-bold">تحلیل هوش مصنوعی کامل شد!</AlertTitle>
            <AlertDescription>
                بر اساس اطلاعاتی که ارائه دادید، نتایج زیر برای شما آماده شده است.
            </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>رشته‌های تحصیلی پیشنهادی</CardTitle>
            <CardDescription>
              در زیر، رشته‌هایی که بیشترین تطابق را با ویژگی‌های شما دارند، معرفی شده‌اند.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {result.suggestedMajors.map((major, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="font-bold text-lg">
                    <div className="flex items-center gap-3">
                      <MajorIcon major={major.major} />
                      {major.major}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 px-2">
                    <div className="flex items-start gap-3">
                      <ThumbsUp className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">نقاط قوت</h4>
                        <p className="text-muted-foreground">{major.strengths}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ThumbsDown className="h-5 w-5 text-red-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">نقاط ضعف</h4>
                        <p className="text-muted-foreground">{major.weaknesses}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 text-blue-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">فرصت‌های شغلی</h4>
                        <p className="text-muted-foreground">{major.careerOpportunities}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <GraduationCap className="h-5 w-5 text-purple-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">مسیرهای تحصیلی آینده</h4>
                        <p className="text-muted-foreground">{major.futureAcademicPaths}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>جمع‌بندی و خلاصه</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{result.summary}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>مسیر گام به گام</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{result.stepByStepPath}</p>
          </CardContent>
        </Card>
        
        <div className="text-center flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button onClick={handlePlayAudio} size="lg" disabled={audioLoading}>
                {audioLoading ? (
                    <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                ) : isPlaying ? (
                    <Pause className="ml-2 h-5 w-5" />
                ) : (
                    <Volume2 className="ml-2 h-5 w-5" />
                )}
                {isPlaying ? 'توقف' : (audioDataUri ? 'پخش مجدد' : 'پخش صوتی نتایج')}
            </Button>
            <Button onClick={resetForm} size="lg" variant="outline">
                <RotateCcw className="ml-2 h-5 w-5" />
                شروع مجدد مشاوره
            </Button>
            <audio ref={audioRef} className="hidden" />
        </div>

      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Progress value={(step / steps.length) * 100} className="w-full" />
        <CardTitle className="pt-4">مرحله {step}: {steps[step - 1].title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            {step === 1 && (
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>علاقه‌مندی‌های شما</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="به چه چیزهایی علاقه دارید؟ سرگرمی‌ها، موضوعات مورد علاقه برای مطالعه، فعالیت‌هایی که از انجامشان لذت می‌برید و..."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {step === 2 && (
              <FormField
                control={form.control}
                name="grades"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نمرات تحصیلی</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="نمرات خود را در دروس اصلی مانند ریاضی، فیزیک، شیمی، زیست، ادبیات، عربی و... بنویسید."
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {step === 3 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="strengths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نقاط قوت</FormLabel>
                      <FormControl>
                        <Textarea placeholder="در چه مهارت‌ها یا دروسی قوی هستید؟ (مثلاً حل مسئله، خلاقیت، ارتباطات، کار گروهی و...)" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weaknesses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نقاط ضعف</FormLabel>
                      <FormControl>
                        <Textarea placeholder="در چه زمینه‌هایی نیاز به بهبود دارید؟" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 4 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="careerGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اهداف شغلی</FormLabel>
                      <FormControl>
                        <Textarea placeholder="در آینده دوست دارید چه شغلی داشته باشید؟ چه محیط کاری را ترجیح می‌دهید؟" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="familyExpectations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>انتظارات خانواده (اختیاری)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="آیا خانواده شما انتظار خاصی در مورد رشته تحصیلی‌تان دارند؟" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
          <ArrowRight className="ml-2 h-4 w-4" />
          قبلی
        </Button>
        {step < steps.length ? (
          <Button onClick={handleNext}>
            بعدی
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={form.handleSubmit(onSubmit)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Sparkles className="ml-2 h-4 w-4" />
            دریافت پیشنهاد
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
