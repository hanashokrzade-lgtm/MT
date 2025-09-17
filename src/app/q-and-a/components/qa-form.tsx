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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Volume2, Pause, RotateCcw } from 'lucide-react';
import {
  generateAnswerForQuestion,
  type GenerateAnswerForQuestionOutput,
} from '@/ai/flows/generate-answer-for-question';
import { generateAudioFromText } from '@/ai/flows/generate-audio-from-text';
import { useToast } from '@/hooks/use-toast';

const qaSchema = z.object({
  question: z.string().min(10, { message: 'لطفاً سوال خود را با حداقل ۱۰ کاراکتر وارد کنید.' }),
});

type QaFormData = z.infer<typeof qaSchema>;

export function QaForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateAnswerForQuestionOutput | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const form = useForm<QaFormData>({
    resolver: zodResolver(qaSchema),
    defaultValues: {
      question: '',
    },
  });

  const onSubmit = async (data: QaFormData) => {
    setLoading(true);
    setResult(null);
    setAudioDataUri(null);
    setIsPlaying(false);

    try {
      const response = await generateAnswerForQuestion(data);
      setResult(response);
    } catch (error) {
      toast({
        title: 'خطا در دریافت پاسخ',
        description: 'متاسفانه در ارتباط با سرویس هوش مصنوعی مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async () => {
    if (!result) return;
    
    if (audioRef.current && audioDataUri) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    setAudioLoading(true);
    try {
      const response = await generateAudioFromText(result.answer);
      setAudioDataUri(response.audioDataUri);
    } catch (error) {
      toast({
        title: 'خطا در تولید صدا',
        description: 'متاسفانه در تولید فایل صوتی مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
        variant: 'destructive',
      });
    } finally {
      setAudioLoading(false);
    }
  };
  
  const resetForm = () => {
    form.reset();
    setResult(null);
    setAudioDataUri(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (audioDataUri && audioRef.current) {
      audioRef.current.src = audioDataUri;
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [audioDataUri]);


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>سوال خود را بپرسید</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سوال شما</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="مثال: تفاوت رشته مهندسی نرم‌افزار و علوم کامپیوتر چیست؟"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                  {loading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      در حال پردازش...
                    </>
                  ) : (
                    <>
                      <Sparkles className="ml-2 h-4 w-4" />
                      دریافت پاسخ
                    </>
                  )}
                </Button>
                {result && (
                     <Button onClick={resetForm} variant="outline" className="w-full sm:w-auto">
                        <RotateCcw className="ml-2 h-4 w-4" />
                        پرسش جدید
                    </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {loading && (
        <Card className="flex flex-col items-center justify-center p-8 min-h-[200px]">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-md text-muted-foreground">کمی صبر کنید، مشاور هوشمند در حال آماده کردن پاسخ است...</p>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>پاسخ مشاور</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{result.answer}</p>
            <Button onClick={handlePlayAudio} size="lg" disabled={audioLoading}>
                {audioLoading ? (
                    <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                ) : isPlaying ? (
                    <Pause className="ml-2 h-5 w-5" />
                ) : (
                    <Volume2 className="ml-2 h-5 w-5" />
                )}
                {isPlaying ? 'توقف' : 'پخش صوتی پاسخ'}
            </Button>
            <audio ref={audioRef} className="hidden" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
