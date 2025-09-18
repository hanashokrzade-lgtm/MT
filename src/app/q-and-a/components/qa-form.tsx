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
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, Volume2, Pause, User, Bot, Send, Mic, UserCircle2 } from 'lucide-react';
import {
  generateAnswerForQuestion,
} from '@/ai/flows/generate-answer-for-question';
import { generateAudioFromText } from '@/ai/flows/generate-audio-from-text';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const qaSchema = z.object({
  question: z.string().min(2, { message: 'لطفاً سوال خود را با حداقل ۲ کاراکتر وارد کنید.' }),
});

type QaFormData = z.infer<typeof qaSchema>;

interface Message {
    type: 'user' | 'bot';
    text: string;
    audioDataUri?: string | null;
    isLoadingAudio?: boolean;
}

// Add this interface for the SpeechRecognition API
interface IWindow extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

export function QaForm() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
      { type: 'bot', text: 'سلام و درود بر شما! خوشحالم که در خدمتتون هستم. من یک مشاور تحصیلی خبره هستم و اینجا هستم تا به تمام سوالات شما در مورد انتخاب رشته، دانشگاه‌ها، بازار کار و آینده تحصیلی پاسخ دهم. لطفاً سوال خود را مطرح کنید تا با دقت و بهترین راهنمایی ممکن، شما را یاری کنم.' }
  ]);
  const [activeAudio, setActiveAudio] = useState<{ index: number; isPlaying: boolean } | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);


  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  const form = useForm<QaFormData>({
    resolver: zodResolver(qaSchema),
    defaultValues: {
      question: '',
    },
  });

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const scrollableView = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollableView) {
            scrollableView.scrollTop = scrollableView.scrollHeight;
        }
    }
  };
  
 useEffect(() => {
    const SpeechRecognition = (window as IWindow).SpeechRecognition || (window as IWindow).webkitSpeechRecognition;
    if (SpeechRecognition && !recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'fa-IR';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        form.setValue('question', transcript, { shouldValidate: true });
        if (transcript.trim().length >= 2) {
            form.handleSubmit(onSubmit)();
        } else {
             toast({
                title: 'سوال کوتاه است',
                description: 'سوال ضبط شده برای ارسال باید حداقل ۲ کاراکتر داشته باشد.',
                variant: 'destructive',
            });
        }
      };

      recognition.onerror = (event: any) => {
        let description = 'متاسفانه مشکلی در تشخیص صدای شما پیش آمد.';
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          description = 'برای استفاده از میکروفون، لطفاً دسترسی لازم را در مرورگر خود فعال کنید.';
        } else if (event.error === 'no-speech') {
            description = 'صدایی تشخیص داده نشد. لطفاً دوباره تلاش کنید و بلندتر صحبت کنید.';
        }
        
        toast({
          title: 'خطا در تشخیص گفتار',
          description: description,
          variant: 'destructive',
        });
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleRecording = async () => {
    if (!recognitionRef.current) {
      toast({
        title: 'مرورگر پشتیبانی نمی‌شود',
        description: 'متاسفانه مرورگر شما از قابلیت تشخیص گفتار پشتیبانی نمی‌کند.',
        variant: 'destructive',
      });
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      return;
    }

    try {
      // Always ask for permission before starting
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (err) {
      if (err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'SecurityError' || err.name === 'NotFoundError')) {
           toast({
              title: 'دسترسی به میکروفون رد شد',
              description: 'برای استفاده از میکروفون، باید دسترسی را مجاز کنید. اگر میکروفونی متصل نیست، لطفاً آن را وصل کنید.',
              variant: 'destructive'
          });
      } else {
          console.error('Error starting recording:', err);
          toast({
              title: 'خطا در شروع ضبط',
              description: 'مشکلی در شروع ضبط صدا به وجود آمد. لطفاً دوباره تلاش کنید.',
              variant: 'destructive'
          });
      }
      setIsRecording(false);
    }
  };

  useEffect(() => {
    const audioEl = activeAudio ? audioRefs.current[activeAudio.index] : null;
    if (audioEl && activeAudio?.isPlaying) {
      audioEl.play().catch(e => {
          console.error("Audio play failed in useEffect:", e);
          toast({ title: 'خطا در پخش صدا', variant: 'destructive' });
          // Reset state if play fails
          setActiveAudio(null);
      });
    } else if (audioEl && !activeAudio?.isPlaying) {
      audioEl.pause();
    }
  }, [activeAudio, toast]);


  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const onSubmit = async (data: QaFormData) => {
    if (loading || data.question.trim().length < 2) return;
    
    // Stop recording if it's active before sending
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setLoading(true);
    setMessages(prev => [...prev, { type: 'user', text: data.question }]);
    form.reset();

    try {
      const response = await generateAnswerForQuestion({ question: data.question });
      setMessages(prev => [...prev, { type: 'bot', text: response.answer, audioDataUri: null, isLoadingAudio: false }]);
    } catch (error) {
      // Keep user message, but show an error message from bot
      setMessages(prev => [...prev, { type: 'bot', text: 'متاسفانه در ارتباط با سرویس هوش مصنوعی مشکلی پیش آمد. لطفاً دوباره تلاش کنید.' }]);
      toast({
        title: 'خطا در دریافت پاسخ',
        description: 'متاسفانه در ارتباط با سرویس هوش مصنوعی مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async (index: number) => {
    // If this audio is currently playing, pause it.
    if (activeAudio?.index === index && activeAudio.isPlaying) {
        setActiveAudio({ index, isPlaying: false });
        return;
    }

    // If another audio is playing, stop it.
    if (activeAudio && activeAudio.index !== index) {
        const otherAudioEl = audioRefs.current[activeAudio.index];
        if (otherAudioEl) {
            otherAudioEl.pause();
            otherAudioEl.currentTime = 0;
        }
    }

    const message = messages[index];
    if (message.type !== 'bot') return;

    const audioEl = audioRefs.current[index];
    if (!audioEl) return;

    // If audio is loaded, just play it.
    if (message.audioDataUri) {
        audioEl.src = message.audioDataUri; // Ensure src is set
        setActiveAudio({ index, isPlaying: true });
        return;
    }

    // If audio is not loaded, fetch it.
    setMessages(prev => prev.map((msg, i) => i === index ? { ...msg, isLoadingAudio: true } : msg));
    setActiveAudio(null);
    try {
        const audioResponse = await generateAudioFromText(message.text);
        const newAudioDataUri = audioResponse.audioDataUri;
        
        setMessages(prev => {
            const newMessages = [...prev];
            const botMessage = newMessages[index];
            if(botMessage.type === 'bot') {
                botMessage.audioDataUri = newAudioDataUri;
                botMessage.isLoadingAudio = false;
            }
            return newMessages;
        });

        // The useEffect will handle playing the audio once the state is updated.
        const targetAudioEl = audioRefs.current[index];
        if (targetAudioEl) {
            targetAudioEl.src = newAudioDataUri;
            setActiveAudio({ index, isPlaying: true });
        }
    } catch (error: any) {
        console.error("Audio generation failed:", error);
        const isQuotaError = error.message && (error.message.includes('429') || error.message.includes('Quota'));
        toast({
            title: 'خطا در تولید صدا',
            description: isQuotaError 
              ? 'متاسفانه سقف استفاده از سرویس صوتی تمام شده است. لطفاً کمی بعد دوباره تلاش کنید.'
              : 'متاسفانه در تولید فایل صوتی مشکلی پیش آمد.',
            variant: 'destructive',
        });
        setMessages(prev => prev.map((msg, i) => i === index ? { ...msg, isLoadingAudio: false } : msg));
        setActiveAudio(null); // Reset active audio on error
    }
};

  const renderMessageContent = (text: string) => {
    // This regex splits the text by numbered lists, bullet points, and newlines
    // while keeping the delimiters for styling.
    const parts = text.split(/(\n\d+\.\s.*?|\n\*\s.*?|\n)/g).filter(Boolean);
    
    return parts.map((part, index) => {
      if (part.match(/^\n\d+\.\s/)) {
        return <p key={index} className="mb-1 pl-4">{part.trim()}</p>;
      }
      if (part.match(/^\n\*\s/)) {
        return <li key={index} className="list-disc list-inside mb-1">{part.replace(/^\n\*\s/, '').trim()}</li>;
      }
      if (part === '\n') {
        return <br key={index} />;
      }
      return <span key={index}>{part}</span>;
    });
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
            <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.type === 'bot' && (
                            <Avatar className="w-9 h-9 border-2 border-primary">
                                <AvatarFallback className="bg-primary/20"><Sparkles className="h-5 w-5 text-primary" /></AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`max-w-xl p-4 rounded-2xl shadow-sm ${message.type === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card border rounded-bl-none'} ${message.type === 'bot' ? 'text-right' : ''}`}>
                            <div className="prose prose-sm max-w-none text-card-foreground leading-relaxed">
                                {renderMessageContent(message.text)}
                            </div>
                             {message.type === 'bot' && (
                                <div className="mt-4 pt-3 border-t border-border/50">
                                    <Button onClick={() => handlePlayAudio(index)} size="sm" variant="ghost" className="h-8 gap-2 text-muted-foreground hover:bg-accent/20 hover:text-accent-foreground" disabled={message.isLoadingAudio}>
                                        {message.isLoadingAudio ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (activeAudio?.index === index && activeAudio.isPlaying) ? (
                                            <Pause className="h-4 w-4" />
                                        ) : (
                                            <Volume2 className="h-4 w-4" />
                                        )}
                                        <span>{(activeAudio?.index === index && activeAudio.isPlaying) ? 'توقف' : 'پخش صوتی'}</span>
                                    </Button>
                                    <audio 
                                        ref={el => audioRefs.current[index] = el}
                                        onEnded={() => setActiveAudio(null)}
                                        onPause={() => {
                                            // Only update if it was this specific audio that was paused.
                                            if (activeAudio?.index === index) {
                                                setActiveAudio({ index, isPlaying: false });
                                            }
                                        }}
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>
                        {message.type === 'user' && (
                             <Avatar className="w-9 h-9">
                                <AvatarFallback><UserCircle2 className="h-5 w-5" /></AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex items-start gap-3 justify-start">
                        <Avatar className="w-9 h-9 border-2 border-primary">
                             <AvatarFallback className="bg-primary/20"><Sparkles className="h-5 w-5 text-primary" /></AvatarFallback>
                        </Avatar>
                        <div className="max-w-xl p-4 rounded-2xl bg-card border rounded-bl-none flex items-center gap-2">
                             <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                             <span className="text-muted-foreground text-sm">در حال فکر کردن...</span>
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
        <div className="p-4 border-t bg-background">
             <Card className="max-w-4xl mx-auto shadow-none">
                <CardContent className="p-2">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      onClick={handleToggleRecording} 
                      size="icon" 
                      variant="ghost" 
                      className={`w-12 h-12 rounded-full flex-shrink-0 transition-colors ${
                        isRecording ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'text-muted-foreground'
                      }`}
                      disabled={loading}
                      title={isRecording ? 'توقف ضبط' : 'شروع ضبط'}
                    >
                        {isRecording ? <Mic className="h-6 w-6 animate-pulse" /> : <Mic className="h-6 w-6" />}
                        <span className="sr-only">{isRecording ? 'توقف ضبط' : 'شروع ضبط'}</span>
                    </Button>
                    <FormField
                        control={form.control}
                        name="question"
                        render={({ field }) => (
                        <FormItem className="flex-grow">
                            <FormControl>
                            <Textarea
                                placeholder={isRecording ? 'در حال شنیدن...' : 'سوال خود را اینجا بنویسید یا با میکروفون بپرسید...'}
                                rows={1}
                                className="resize-none border-0 shadow-none focus-visible:ring-0 min-h-0 h-auto py-3"
                                {...field}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (form.getValues('question').trim().length >= 2) {
                                            form.handleSubmit(onSubmit)();
                                        }
                                    }
                                }}
                            />
                            </FormControl>
                            <FormMessage className="absolute bottom-full mb-2" />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={loading || form.watch('question').trim().length < 2} size="icon" className="w-12 h-12 rounded-full flex-shrink-0 bg-accent hover:bg-accent/90">
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <Send className="h-6 w-6" />
                        )}
                        <span className="sr-only">ارسال</span>
                    </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
