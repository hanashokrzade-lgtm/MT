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
import { Loader2, Sparkles, Volume2, Pause, User, Bot, Send, Mic, MicOff } from 'lucide-react';
import {
  generateAnswerForQuestion,
} from '@/ai/flows/generate-answer-for-question';
import { generateAudioFromText } from '@/ai/flows/generate-audio-from-text';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const qaSchema = z.object({
  question: z.string().min(10, { message: 'لطفاً سوال خود را با حداقل ۱۰ کاراکتر وارد کنید.' }),
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeAudio, setActiveAudio] = useState<{ index: number; isPlaying: boolean } | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [micPermission, setMicPermission] = useState<PermissionState | 'unsupported'>('prompt');
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
    if (!SpeechRecognition) {
      setMicPermission('unsupported');
      return;
    }

    const checkPermission = () => {
        navigator.permissions.query({ name: 'microphone' as PermissionName }).then((permissionStatus) => {
            setMicPermission(permissionStatus.state);
            permissionStatus.onchange = () => {
                setMicPermission(permissionStatus.state);
            };
        });
    }

    checkPermission();

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'fa-IR';
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      form.setValue('question', transcript, { shouldValidate: true });
      if (transcript.trim().length >= 10) {
        form.handleSubmit(onSubmit)();
      } else {
        toast({
          title: 'سوال کوتاه است',
          description: 'سوال ضبط شده برای ارسال باید حداقل ۱۰ کاراکتر داشته باشد.',
          variant: 'destructive',
        });
      }
    };

    recognition.onerror = (event: any) => {
      let description = 'متاسفانه مشکلی در تشخیص صدای شما پیش آمد.';
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        description = 'برای استفاده از میکروفون، لطفاً دسترسی لازم را در مرورگر خود فعال کنید.';
        setMicPermission('denied');
      } else if (event.error === 'no-speech') {
        description = 'صدایی تشخیص داده نشد. لطفاً دوباره تلاش کنید.';
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
  }, [form, toast]);


  const handleToggleRecording = async () => {
    if (micPermission === 'unsupported' || !recognitionRef.current) {
        toast({
            title: 'مرورگر پشتیبانی نمی‌شود',
            description: 'متاسفانه مرورگر شما از قابلیت تشخیص گفتار پشتیبانی نمی‌کند.',
            variant: 'destructive',
        });
        return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    if (micPermission === 'denied') {
        toast({
            title: 'دسترسی به میکروفون مسدود است',
            description: 'لطفاً از تنظیمات مرورگر خود دسترسی به میکروفون را برای این سایت فعال کنید.',
            variant: 'destructive',
        });
        return;
    }

    if (micPermission === 'prompt') {
        try {
            // Request permission by trying to get user media
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Stop the stream immediately, we only needed it for the permission prompt
            stream.getTracks().forEach(track => track.stop());
            setMicPermission('granted');
            // Now that permission is granted, we can start recording
            recognitionRef.current.start();
            setIsRecording(true);
        } catch (err) {
            setMicPermission('denied');
            toast({
                title: 'دسترسی به میکروفون رد شد',
                description: 'برای استفاده از میکروفون، باید دسترسی را مجاز کنید.',
                variant: 'destructive'
            });
        }
    } else if (micPermission === 'granted') {
        try {
            recognitionRef.current.start();
            setIsRecording(true);
        } catch(e) {
            // This might happen if permission is revoked between checks
            setIsRecording(false);
            if (e instanceof DOMException && (e.name === "NotAllowedError" || e.name === "SecurityError")) {
                setMicPermission('denied');
                toast({
                    title: 'خطا در شروع ضبط',
                    description: 'دسترسی به میکروفون مجاز نیست. لطفاً دسترسی را در مرورگر خود فعال کنید.',
                    variant: 'destructive',
                });
            }
        }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const onSubmit = async (data: QaFormData) => {
    if (loading || data.question.trim().length < 10) return;
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
    const message = messages[index];
    if (message.type !== 'bot') return;

    // Pause currently playing audio if it's a different one
    if (activeAudio && activeAudio.index !== index && audioRefs.current[activeAudio.index]) {
      audioRefs.current[activeAudio.index]?.pause();
    }
    
    const audio = audioRefs.current[index];
    if (!audio) return;

    // If the clicked audio is currently playing, pause it
    if (activeAudio?.index === index && activeAudio.isPlaying) {
        audio.pause();
        setActiveAudio({ index, isPlaying: false });
        return;
    }
    
    // If audio is paused, play it
    if (activeAudio?.index === index && !activeAudio.isPlaying) {
        audio.play().catch(console.error);
        setActiveAudio({ index, isPlaying: true });
        return;
    }

    // If audio is not loaded, fetch it
    if (!message.audioDataUri) {
        setMessages(prev => prev.map((msg, i) => i === index ? { ...msg, isLoadingAudio: true } : msg));
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

            // Use a timeout to ensure state has updated and src is set before playing
            setTimeout(() => {
                const currentAudio = audioRefs.current[index];
                if(currentAudio){
                    currentAudio.src = newAudioDataUri;
                    currentAudio.play().catch(e => {
                        console.error("Audio play failed:", e);
                         toast({ title: 'خطا در پخش صدا', variant: 'destructive' });
                    });
                    setActiveAudio({ index, isPlaying: true });
                }
            }, 0);

        } catch (error) {
            console.error("Audio generation failed:", error);
            toast({
                title: 'خطا در تولید صدا',
                description: 'متاسفانه در تولید فایل صوتی مشکلی پیش آمد.',
                variant: 'destructive',
            });
            setMessages(prev => prev.map((msg, i) => i === index ? { ...msg, isLoadingAudio: false } : msg));
        }
    } else {
        // If audio is already loaded, just play
        audio.play().catch(console.error);
        setActiveAudio({ index, isPlaying: true });
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
                {messages.length === 0 && !loading && (
                    <Alert className="border-accent bg-accent/10">
                        <Sparkles className="h-4 w-4 text-accent-foreground" />
                        <AlertTitle className="text-accent-foreground">شروع گفتگو</AlertTitle>
                        <AlertDescription className="text-accent-foreground/80">
                            می‌توانید سوال خود را در مورد رشته‌های تحصیلی، دانشگاه‌ها، بازار کار و آینده شغلی از مشاور هوشمند بپرسید.
                        </AlertDescription>
                    </Alert>
                )}
                {messages.map((message, index) => (
                    <div key={index} className={`flex items-start gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.type === 'bot' && (
                            <Avatar className="w-9 h-9 border-2 border-primary">
                                <AvatarFallback className="bg-primary/20"><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`max-w-xl p-4 rounded-2xl shadow-sm ${message.type === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card border rounded-bl-none'}`}>
                            <div className="prose prose-sm max-w-none text-card-foreground leading-relaxed">
                                {renderMessageContent(message.text)}
                            </div>
                             {message.type === 'bot' && (
                                <div className="mt-4 pt-3 border-t border-border/50">
                                    <Button onClick={() => handlePlayAudio(index)} size="sm" variant="ghost" className="h-8 gap-2 text-muted-foreground hover:bg-accent/20 hover:text-accent-foreground">
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
                                        onPlay={() => setActiveAudio({ index, isPlaying: true })}
                                        onPause={() => setActiveAudio({ index, isPlaying: false })}
                                        onEnded={() => setActiveAudio({ index, isPlaying: false })}
                                        className="hidden"
                                        src={message.audioDataUri || undefined}
                                    />
                                </div>
                            )}
                        </div>
                        {message.type === 'user' && (
                             <Avatar className="w-9 h-9">
                                <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex items-start gap-3 justify-start">
                        <Avatar className="w-9 h-9 border-2 border-primary">
                             <AvatarFallback className="bg-primary/20"><Bot className="h-5 w-5 text-primary" /></AvatarFallback>
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
                      disabled={loading || micPermission === 'unsupported'}
                      title={micPermission === 'denied' ? 'دسترسی به میکروفون مسدود است' : (isRecording ? 'توقف ضبط' : 'شروع ضبط')}
                    >
                        {micPermission !== 'granted' ? <MicOff className="h-6 w-6" /> : <Mic className={`h-6 w-6 ${isRecording ? 'animate-pulse' : ''}`} />}
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
                                        if (form.getValues('question').trim().length >= 10) {
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
                    <Button type="submit" disabled={loading || form.watch('question').trim().length < 10} size="icon" className="w-12 h-12 rounded-full flex-shrink-0 bg-accent hover:bg-accent/90">
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
             {micPermission === 'denied' && (
                <p className="text-xs text-destructive text-center mt-2">
                    شما دسترسی به میکروفون را مسدود کرده‌اید. لطفاً از تنظیمات مرورگر خود دسترسی را فعال کنید.
                </p>
            )}
             {micPermission === 'unsupported' && (
                <p className="text-xs text-destructive text-center mt-2">
                    متاسفانه مرورگر شما از قابلیت تشخیص گفتار پشتیبانی نمی‌کند.
                </p>
            )}
        </div>
    </div>
  );
}

    