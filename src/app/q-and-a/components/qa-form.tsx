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
import { Loader2, Sparkles, Volume2, Pause, User, Bot, Send } from 'lucide-react';
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

export function QaForm() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeAudio, setActiveAudio] = useState<{ index: number; isPlaying: boolean } | null>(null);

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
    scrollToBottom();
  }, [messages, loading]);

  const onSubmit = async (data: QaFormData) => {
    setLoading(true);
    setMessages(prev => [...prev, { type: 'user', text: data.question }]);
    form.reset();

    try {
      const response = await generateAnswerForQuestion({ question: data.question });
      setMessages(prev => [...prev, { type: 'bot', text: response.answer, audioDataUri: null, isLoadingAudio: false }]);
    } catch (error) {
      setMessages(prev => prev.slice(0, -1)); // Remove user message if AI fails
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

    // Pause currently playing audio if it's different from the one clicked
    if (activeAudio && activeAudio.index !== index && audioRefs.current[activeAudio.index]) {
      audioRefs.current[activeAudio.index]?.pause();
      setActiveAudio(null);
    }
    
    const audio = audioRefs.current[index];
    if (!audio) return;

    // If the clicked audio is currently playing, pause it
    if (activeAudio?.index === index && activeAudio.isPlaying) {
        audio.pause();
        setActiveAudio({ index, isPlaying: false });
        return;
    }
    
    // If audio is already loaded, just play
    if (message.audioDataUri) {
        audio.play();
        setActiveAudio({ index, isPlaying: true });
        return;
    }

    // If audio is not loaded, fetch it
    setMessages(prev => prev.map((msg, i) => i === index ? { ...msg, isLoadingAudio: true } : msg));
    try {
        const audioResponse = await generateAudioFromText(message.text);
        const newAudioDataUri = audioResponse.audioDataUri;
        
        setMessages(prev => prev.map((msg, i) => i === index ? { ...msg, audioDataUri: newAudioDataUri, isLoadingAudio: false } : msg));

        // Use a useEffect to play the audio once the src is set
        audio.src = newAudioDataUri;
        audio.play();
        setActiveAudio({ index, isPlaying: true });

    } catch (error) {
        toast({
            title: 'خطا در تولید صدا',
            description: 'متاسفانه در تولید فایل صوتی مشکلی پیش آمد.',
            variant: 'destructive',
        });
        setMessages(prev => prev.map((msg, i) => i === index ? { ...msg, isLoadingAudio: false } : msg));
    }
  };

  const renderMessageContent = (text: string) => {
    const parts = text.split(/(\n\d+\.\s.*|\n\*\s.*)/).filter(Boolean);
    return parts.map((part, index) => {
        if (part.match(/^\n\d+\.\s/)) { 
            return <p key={index} className="mb-2 pl-4">{part.trim()}</p>;
        }
        if (part.match(/^\n\*\s/)) {
            return <li key={index} className="list-disc list-inside mb-1">{part.replace(/^\n\*\s/, '').trim()}</li>;
        }
        return part.split('\n').map((line, lineIndex) => <p key={`${index}-${lineIndex}`} className="mb-2">{line || <br/>}</p>);
    });
  }

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
                        <div className={`max-w-xl p-4 rounded-2xl ${message.type === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card border rounded-bl-none'}`}>
                            <div className="leading-relaxed whitespace-normal prose prose-sm max-w-none text-card-foreground">
                                {renderMessageContent(message.text)}
                            </div>
                             {message.type === 'bot' && (
                                <div className="mt-4 pt-3 border-t border-border">
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
                                        onEnded={() => setActiveAudio({ index, isPlaying: false })}
                                        className="hidden"
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
             <Card className="max-w-4xl mx-auto">
                <CardContent className="p-2">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                    <FormField
                        control={form.control}
                        name="question"
                        render={({ field }) => (
                        <FormItem className="flex-grow">
                            <FormControl>
                            <Textarea
                                placeholder="سوال خود را اینجا بنویسید..."
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
                            <FormMessage className="pl-3" />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={loading || form.getValues('question').trim().length < 10} size="icon" className="w-12 h-12 rounded-full flex-shrink-0 bg-accent hover:bg-accent/90">
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
